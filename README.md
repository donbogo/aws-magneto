# aws-magneto

Clonar o descargar el proyecto:
- Clone: https://github.com/donbogo/aws-magneto.git
- Download zip: https://github.com/donbogo/aws-magneto/archive/main.zip

___

### Solución

![](https://raw.githubusercontent.com/donbogo/aws-magneto/main/aws-solucion.jpg)

___

### Instalación
Este es un proyecto desarrollado para ser ejecutado bajo Node.js, antes de instalarlo, descargar e instalar [Node.js](https://nodejs.org/en/download/). Node.js 10.X o superior.

Una vez clonado o descargado el proyecto, ubicarse en el directorio: **./aws-magneto**
> $ ./aws-magneto>

Para la instalación del proyecto ejecutar el comando:
> $ npm install

___

### Cómo usar

Este proyecto esta creado para ser desplegado en la nube de aws, por tal motivo dentro del proyecto se agregan los archivos: **magneto-api-stack.json** y **serverless.yml**

- Para la creación del api gateway, crear en cloudformation el stack **api-gateway-magneto** a partir del archivo [magneto-api-stack.json](https://github.com/donbogo/aws-magneto/blob/main/magneto-api-stack.json)
- Para el despliegue y la creación de las funciones lambdas: **mutant** y **stats**, y para la creación de las tablas en dynamodb: **adns** y **stats**, se hace por medio de [serverless](https://www.serverless.com/framework/docs/providers/aws/guide/intro/).

 `$ ./aws-magneto> serverless deploy --stage dev --account <#cuenta aws> --region us-east-1 --log INFO --verbose`

___

### Servicios web

- /magneto/mutant
![](https://raw.githubusercontent.com/donbogo/aws-magneto/main/ws-mutant.jpg)

 Ejemplo body:
`{"adn": ["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]}`

- /magneto/stats
![](https://raw.githubusercontent.com/donbogo/aws-magneto/main/ws-stats.jpg)

___

### Test-Automáticos, Code coverage
Para correr las pruebas y la cobertura de código, primero instalar las dependencias con el comando **npm install** y luego ejecutar el test con el comando **npm test**:
 
 > $ npm install
 
 > $ npm test

<br>
