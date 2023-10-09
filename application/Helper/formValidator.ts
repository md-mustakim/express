export default class FormValidator {
private errors: any = {};
    private body: any;
    private rules: any;
    private messages: any;
    private validation: any;
    private validationStatus: boolean = true;
    private validationMessage: string = '';
    constructor(body: any, rules: any, messages: any = {}) {
        this.body = body;
        this.rules = rules;
        this.messages = messages;
    }
    public validate() {
        for (let field in this.rules) {
            let fieldRules = this.rules[field].split('|');
            for (let rule of fieldRules) {
                if (rule.includes(':')) {
                    let ruleSplit = rule.split(':');
                    let ruleName = ruleSplit[0];
                    let ruleValue = ruleSplit[1];
                    this.validation = this[ruleName](field, ruleValue);
                } else {
                    this.validation = this[rule](field);
                }
                if (!this.validation) {
                    break;
                }
            }
        }
        return this;
    }
    public fails() {
        return !this.validationStatus;
    }

    public message() {
        return this.validationMessage;
    }
    public required(field: string) {
        if (!this.body.hasOwnProperty(field)) {
            this.errors[field] = {
                msg: this.messages.hasOwnProperty(field) ? this.messages[field] : field + ' is required.',
            }
            this.validationStatus = false;
            this.validationMessage = this.messages.hasOwnProperty(field) ? this.messages[field] : field + ' is required.';
            return false;
        }
        return true;
    }
    public email(field: string) {
        if (!this.body[field].match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
            this.errors[field] = {
                msg: this.messages.hasOwnProperty(field) ? this.messages[field] : field + ' is invalid.',
            }
            this.validationStatus = false;
            this.validationMessage = this.messages.hasOwnProperty(field) ? this.messages[field] : field + ' is invalid.';
            return false;
        }
        return true;
    }
    public min(field: string, length: number) {
        if (this.body[field].length < length) {
            this.errors[field] = {
                msg: this.messages.hasOwnProperty(field) ? this.messages[field] : field + ' is too short.',
            }
            this.validationStatus = false;
            this.validationMessage = this.messages.hasOwnProperty(field) ? this.messages[field] : field + ' is too short.';
            return false;
        }
        return true;
    }


}