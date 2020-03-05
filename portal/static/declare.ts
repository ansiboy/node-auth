
declare module "js-md5" {
	let md5: {
		(text: string): string;
	};
	export = md5;
}

declare type RequireFunction = (modules: string[], callback?: Function, err?: Function) => void;

declare let requirejs: {
	(config: RequireConfig, modules: string[], callback?: Function, err?: Function);
	(config: RequireConfig): RequireFunction;
	(modules: string[], callback?: Function, err?: Function);
	config: Function;
	exec(name: string);
	load(context: RequireContext, id: string, url: string);
};

type RequireContext = {
	config: RequireConfig
}

interface RequireConfig {

	/**
	* The root path to use for all module lookups.
	*/
	baseUrl?: string;

	/**
	* Path mappings for module names not found directly under
	* baseUrl.
	*/
	paths?: { [key: string]: any; };


	/**
	* Dictionary of Shim's.
	* Can be of type RequireShim or string[] of dependencies
	*/
	shim?: { [key: string]: RequireShim | string[]; };

	/**
	* For the given module prefix, instead of loading the
	* module with the given ID, substitude a different
	* module ID.
	*
	* @example
	* requirejs.config({
	*	map: {
	*		'some/newmodule': {
	*			'foo': 'foo1.2'
	*		},
	*		'some/oldmodule': {
	*			'foo': 'foo1.0'
	*		}
	*	}
	* });
	**/
	map?: {
		[id: string]: {
			[id: string]: string;
		};
	};

	/**
	* Allows pointing multiple module IDs to a module ID that contains a bundle of modules.
	*
	* @example
	* requirejs.config({
	*	bundles: {
	*		'primary': ['main', 'util', 'text', 'text!template.html'],
	*		'secondary': ['text!secondary.html']
	*	}
	* });
	**/
	bundles?: { [key: string]: string[]; };

	/**
	* AMD configurations, use module.config() to access in
	* define() functions
	**/
	config?: { [id: string]: {}; };

	/**
	* Configures loading modules from CommonJS packages.
	**/
	packages?: {};

	/**
	* The number of seconds to wait before giving up on loading
	* a script.  The default is 7 seconds.
	**/
	waitSeconds?: number;

	/**
	* A name to give to a loading context.  This allows require.js
	* to load multiple versions of modules in a page, as long as
	* each top-level require call specifies a unique context string.
	**/
	context?: string;

	/**
	* An array of dependencies to load.
	**/
	deps?: string[];

	/**
	* A function to pass to require that should be require after
	* deps have been loaded.
	* @param modules
	**/
	callback?: (...modules: any[]) => void;

	/**
	* If set to true, an error will be thrown if a script loads
	* that does not call define() or have shim exports string
	* value that can be checked.
	**/
	enforceDefine?: boolean;

	/**
	* If set to true, document.createElementNS() will be used
	* to create script elements.
	**/
	xhtml?: boolean;

	/**
	* Extra query string arguments appended to URLs that RequireJS
	* uses to fetch resources.  Most useful to cache bust when
	* the browser or server is not configured correctly.
	*
	* @example
	* urlArgs: "bust= + (new Date()).getTime()
	*
 	* As of RequireJS 2.2.0, urlArgs can be a function. If a
	* function, it will receive the module ID and the URL as
	* parameters, and it should return a string that will be added
	* to the end of the URL. Return an empty string if no args.
	* Be sure to take care of adding the '?' or '&' depending on
	* the existing state of the URL.
	*
	* @example

	* requirejs.config({
	* 	urlArgs: function(id, url) {
	* 		var args = 'v=1';
	*		if (url.indexOf('view.html') !== -1) {
	* 			args = 'v=2'
	* 		}
	*
	*		return (url.indexOf('?') === -1 ? '?' : '&') + args;
	* 	}
	* });
	**/
	urlArgs?: string | ((id: string, url: string) => string);

	/**
	* Specify the value for the type="" attribute used for script
	* tags inserted into the document by RequireJS.  Default is
	* "text/javascript".  To use Firefox's JavasScript 1.8
	* features, use "text/javascript;version=1.8".
	**/
	scriptType?: string;

	/**
	* If set to true, skips the data-main attribute scanning done
	* to start module loading. Useful if RequireJS is embedded in
	* a utility library that may interact with other RequireJS
	* library on the page, and the embedded version should not do
	* data-main loading.
	**/
	skipDataMain?: boolean;

	/**
	* Allow extending requirejs to support Subresource Integrity
	* (SRI).
	**/
	onNodeCreated?: (node: HTMLScriptElement, config: RequireConfig, moduleName: string, url: string) => void;
}

interface RequireShim {

	/**
	* List of dependencies.
	**/
	deps?: string[];

	/**
	* Name the module will be exported as.
	**/
	exports?: string;

	/**
	* Initialize function with all dependcies passed in,
	* if the function returns a value then that value is used
	* as the module export value instead of the object
	* found via the 'exports' string.
	* @param dependencies
	* @return
	**/
	init?: (...dependencies: any[]) => any;
}

// declare module "json!websiteConfig" {
// 	let a: PortalWebsiteConfig & import("maishu-chitu-admin/static").WebsiteConfig;
// 	export = a;
// }
