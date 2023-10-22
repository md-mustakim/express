import express, { Express, Request, Response, NextFunction } from 'express';

import apiResponse from "./application/Helper/apiResponse";
import UserAgent from "./application/Helper/UserAgent";
import router from "./application/Router/api/v1/api";
import authenticateRouter from "./application/Router/api/v1/authenticatedRouter";



const app: Express = express();
const port = 4000;

const ipv4AndIpv6 = (ip: string)=>  {
    let ipv4Address:any = '';
    let ipv6Address: string | undefined = '';
    if(ip.includes(':')) {
        // ip = ::ffff:103.121.216.59;
       // need to get ::ffff: from the ip

        if(ip.includes('.')) {
            const lastIndex = ip.lastIndexOf(':');
            ipv6Address = ip.slice(0, lastIndex + 1);
        }else {
            ipv6Address = ip;
        }

    }
    if(ip.includes('.')) {
        ipv4Address = ip.split(':').pop();
    }
    return {ipv4Address: ipv4Address, ipv6Address: ipv6Address};
}


app.use(express.json());

app.use('/public', express.static('public'));


app.get('/', async (req: Request, res: Response) => {
    const ip = req.ips.length > 0 ? req.ips[0] : req.ip;
    const ua = await new UserAgent().get(req);
    apiResponse.success(res, 'Welcome to Track My Show API Server 👌', {ip: ipv4AndIpv6(req.ip), device: ua});

});

app.use('/api/v1/auth', router);
app.use('/api/v1', authenticateRouter);
app.use((req: Request, res: Response) => {
    apiResponse.notFound(res,  'URL Not Found', []);
});



app.listen(port,  () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});