========================================
APLICACION 01: EVNT_PRODUCER (simple)
========================================
node producer_nodejs.js

REFERNCIAS
- https://github.com/SOHU-Co/kafka-node
- http://www.conductor.com/nightlight/build-real-time-data-stream-miley-cyrus/

 
========================================
APLICACION 01: EVNT_PRODUCER (mean.js)
========================================
windows
- instalar node 5.1.0	
- install git
- add to path

#### instalar paquetes de node (correr consola como administrador)
npm install -g bower
npm install -g grunt-cli
npm install -g yo
npm install -g gulp

# instalar generador de apoyo
npm install -g generator-meanjs
npm install -g generator-meanjs-table (para usar angular-formly)

# crear proyecto scaffold para la app (windows)

cd C:\.apps\e_aj.Apps\.ws\ARQ\trunk\02_Proyectos\0028_Aj_Baseline_Ciclo01\03_construccion\evnt_base
git clone https://github.com/meanjs/mean.git evnt_producer_meanjs
cd evnt_producer_meanjs
npm install
bower install


instalar ruby & sass
-> install ruby 2.2.3
-> npm install grunt-contrib-sass --save-dev
-> adicionar al path


-> subir app
grunt --force

-> sube en el 3000
crear usuario admin
passwword: Welcome10@

===========================================
REFERENCIAS PLANTILLAS
===========================================

* Lumix (http://ui.lumapps.com/), angular-formly-templates-lumx
* admin-lte
* sb admin
* Bootstrap 3

===========================================
REFERENCIAS - MEAN.JS
===========================================
* tutorial de mean (con paginacion1): http://code.ciphertrick.com/2015/07/10/mean-tutorial-build-front-end-angularjs/
* tutorial de mean (con paginacion2): http://code.ciphertrick.com/2015/08/31/server-side-pagination-in-angularjs/
* tutorial de mean (con paginacion3):http://www.ameanmagazine.com/2014/08/top-5-angularjs-pagination-demos-2014.html


===========================================
REFERENCIAS - AUTMATIC FORM GENERATION
===========================================
* formly (meanjs-angular) 	[http://angular-formly.com/ , http://docs.angular-formly.com/docs ] (integtrado apra mean.js se eintegra con los schemas)
* tutorial formly1: https://scotch.io/tutorials/easy-angularjs-forms-with-angular-formly
* forms-angular 						[http://www.forms-angular.org/#/]
* angular schemaform (hace uso de json schema):  recomendado por inspinia (solo genera ls formas) https://github.com/Textalk/angular-schema-form (http://schemaform.io/) ... lo integran con meteor....
* meanjs-table: tablas y formas (lasta blas generan errores de dependencias): http://www.jlmonteagudo.com/2015/03/aumenta-tu-productividad-con-generator-meanjs-table-parte-12/


============================================
ERRORES CONOCIDOS
============================================
- error de dependencias
# como administrador
#	bower cache clean
#	npm cache clean
# actualizar npm
# npm update -g npm



# crear proyectos-scaffold de ejemplo con este generador
# cd /.apps
# yo meanjs (para linux)

	

linux

#install node 0.12.7
wget https://nodejs.org/download/release/v0.12.8/node-v0.12.8-linux-x64.tar.gz
gunzip node-v0.12.8-linux-x64.tar.gz
tar -xvf node-v0.12.8-linux-x64.tar
#install git (sudo yum install git-all)

# add to path
sudo vi /etc/profile
export PATH=/.work/node-v0.12.8-linux-x64:$PATH
source /etc/profile

fedora 23
user: root
pwd: admin




dependencias adicionales
* bower install api-check angular-formly angular-formly-templates-bootstrap --save

* "ng-table": "~0.3.3"

alternativas de paginacion
* http://ui-grid.info


