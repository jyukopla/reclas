reclas
=========================

This is a Plone theme based on Webpack.


Build with a local Plone site
-----------------------------

Start Plone and webpack-dev-server:

.. code:: shell

   $ make watch

An example Plone site with hot-reloaded theme should be now available
at http://localhost:8080/Plone/ (at first, the theme must be manually
enabled from the configuration panel).

Production theme is built with:

.. code:: shell

   $ make

Please, note that Plone must be running while running the build, because
webpack fetches all the default resources directly from a Plone site.


Build with a vagrant based Plone site
-------------------------------------

Start Plone and webpack-dev-server:

.. code:: shell

   $ make -f Makefile.vagrant watch

Production theme is built with:

.. code:: shell

   $ make -f Makefile.vagrant
