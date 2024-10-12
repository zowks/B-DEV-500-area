# Common

This directory contains common files that are used by multiple or all **Area**
sub-projects.

> [!TIP]
> Here are files like API utilities functions for *frontend* and *mobile*.

> [!NOTE]
> This directory is not really a package since it doesn't have an `index` file at the root,
> and it's imported with full-path (e.g. `../../node_modules/area-common/[...]` in *frontend* and *mobile*) ;
> but it's a good way to share common files between projects and making a real package would be a waste of time.
