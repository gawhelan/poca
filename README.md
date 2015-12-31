Poca
====

Run remote scripts locally.

This tool allows you to fetch scripts that are stored on a remote
server and execute them on your local machine. To execute a script
you need to specify the *collection* that the script is a part of and
the *name* of the script. For example:

    $ poca wordpress init

The above command will execute the `init` script from the `wordpress`
collection.

## Configuration

Configuration details for `poca` are defined in your local `.poca`
file that is located in your home directory. If this file does not
exist you need to create it. At a minimum, this file needs to define
the set of *collections* available. See the `Collections` section
below for details on how to define collections.

## Collections

Collections are defined in the `collections` section of your local
`.poca` config file that should be located in your home directory.
`collections` must be an array of objects where each object has the
following properties:

  - `name`: the name of the collection
  - `url`: the base URL to use for fetching scripts.

The following is an example `.poca` file that defines two
collections: `wordpress` and `mysql`.

    ---
    collections:
      - name: wordpress
        url: https://github.com/joebloggs/poca-scripts/wordpress/
      - name: mysql
        url: https://github.com/joebloggs/poca-scripts/mysql/

With the above configuration file you can execute scripts within
one of the defined collections as follows:

    $ poca wordpress init

The above command will combine the collection's `url` property with
the script name `init` and try to fetch the file located at the url
`https://github.com/joebloggs/poca-scripts/wordpress/init`. If the
file is successfully retrieved from the server, it is saved to a
temporary location and executed.

## Scripts

Scripts are just normal executable files. They can be written in
any scripting language but each file should begin with a *shebang*
indicating what interpreter to use for executing the script. For
example:

    #!/usr/bin/env php
    <?php
    echo "This is a PHP script.";

or:

    #!/usr/bin/env node
    console.log('This is a node script.');

or:

    #!/usr/bin/env bash
    echo "This is a Bash script."
