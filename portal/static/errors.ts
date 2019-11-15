export let errors = {
    argumentNull(argumentName: string) {
        let error = new Error(`Argument ${argumentName} can not be null or empty.`);
        return error;
    }
}