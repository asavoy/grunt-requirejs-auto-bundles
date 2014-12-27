# grunt-requirejs-auto-bundles

> Automated shared bundles for grunt-contrib-requirejs.

This task automatically updates and optimizes your `modules:` config for 
RequireJS optimizer builds. 

This means you can create projects that have multiple "main" or "entry" 
modules, but also easily have all common modules placed into bundles to reduce 
total download for your users.

This leaves you the freedom to focus on setting your module dependencies 
accurately, instead of optimally for your builds.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out 
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains 
how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as 
install and use Grunt plugins. Once you're familiar with that process, you may 
install this plugin with this command:

```shell
npm install grunt-requirejs-auto-bundles --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile 
with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-requirejs-auto-bundles');
```

## The "autobundles" task

### Overview

This task reads your `requirejs.config()` and your `grunt-contrib-requirejs` 
build config, figures out the contents of the shared bundles, then updates your 
`modules:` config for your `requirejs` task (it won't produce the final build).
 
Therefore, it is advised to begin with `grunt-contrib-requirejs` and get that 
working with the `dir:` and `modules:` options for its `requirejs` task.

Then, in your project's Gruntfile, add a section named `autobundles` to the 
data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  autobundles: {
    your_target: {
      requireConfigModule: 'require-config'
    },
  },
  requirejs: {
    your_target: {
      // Your `requirejs` config goes here, at a minimum you must have:
      appDir: 'path/to/app',
      baseUrl: './',
      dir: 'path/to/build',
      modules: [
        { name: 'require-config' },
        { name: 'main-a' },
        { name: 'main-b' }
      ]
    }
  }
});
```

Then, you should configure your build task to first run `autobundles` before 
`requirejs`:

```js
grunt.registerTask('build', ['autobundles', 'requirejs']);
```


### Options

#### options.requireConfigModule
Type: `String`
Default value: `'require-config'`

The module ID for the JS file that calls `requirejs.config({ ... })`.


### Usage Examples

In addition to the example task configuration above, you're expected to setup
your project like so:

Contents of `require-config.js`:

```js
requirejs.config({
    // Your RequireJS loader config goes here.
});
```

In your HTML, you'll need to load your `require-config.js` first, then your
"main" module.

When in development, you'll want to do something like this:

```html
<script src="/src/require.js"></script>
<script>
    require.config({
        baseUrl: '/src'
    });
    require(['require-config'], function() {
        require(['main-a']);
    });
</script>
```

When in production, you'll want to change the paths to point to the build dir
as specified by the `dir:` setting for `requirejs`:

```html
<script src="/build/require.js"></script>
<script>
    require.config({
        baseUrl: '/build'
    });
    require(['require-config'], function() {
        require(['main-a']);
    });
</script>
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding 
style. Add unit tests for any new or changed functionality. Lint and test your 
code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
