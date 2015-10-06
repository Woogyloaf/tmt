## Install Packages

After cloning the project to your computer run the following command in your terminal to install all required node and bower packages.

	1.  sudo npm install && bower install	
		

## Start

	gulp

## Build

Create a deployment build with the following commands:

	gulp build

## Test App Build

To fire up a server and test the final build:

	gulp build:serve

---------------------------------------

## gulpfile.js
Javascript concatenation is done in the config object in the guilpfile.  This controls the order as well as files to be be concatenated.  I went with a simple system in anticipation of ES6 built-in modules.  The config object also controls which files are EXCLUDED from the final build.

## .bowerrc
Controls the location where bower packages will be installed.
