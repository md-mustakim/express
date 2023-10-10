export default class HelperFunction{
    public static validationErrorFormat({msg, path}: any)  {
        return {
            field: path,
            message: msg
        }
    }
}

