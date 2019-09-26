export let errors = {
    argumentNull(name: string) {
        let msg = `Argument ${name} is null or empty.`
        let error = new Error(msg)
        error.name = errors.argumentNull.name
        return error
    }
}