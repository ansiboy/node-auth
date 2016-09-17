import * as service from './service';

interface Application {

}

export function add() {

}
export function list(): JQueryPromise<Array<Application>> {
    return service.ajax<Array<Application>>('application/list');
}