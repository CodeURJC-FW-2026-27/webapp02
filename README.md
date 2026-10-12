# STEP-UP
## INTEGRANTES DEL GRUPO
  - **Raúl Cabezas Vallecillo** 
    - r.cabezas.2025@alumnos.urjc.es 
    - Nombre Usuario: Raul-Bucle-Infinito
  - **Sergio García García**
    - s.garciaga.2025@alumnos.urjc.es
    - Nombre Usuario: SergioGarciiaa
  - **Alejandro Rodado López de la Reina**
    - a.rodado.2025@alumnos.urjc.es
    - Nombre Usuario: AlejandroRodado

## HERRAMIENTA DE ORGANIZACIÓN (Trello)
Link: https://trello.com/b/QeTs9v9o/step-up-web

## FUNCIONALIDAD
- Entidades:
    - **Entidad Principal: Zapatilla**
        - Id_Zapatilla
        - Name
        - Brand
        - Price
        - Size
        - Colour
        - Sport
        - Description
        - Stock
        - Photo (cada una tendrá su foto principal y después se incluirán mas fotos de distintas vistas).    

    - **Entidad Secundaria: Reseña**
        - Text
        - Rating
        - User
        - Date
     
[📊 Inventario de zapatillas](https://urjc-my.sharepoint.com/:x:/g/personal/a_rodado_2025_alumnos_urjc_es/IQBJ9jFyPAADR5sfNATojpUjAY3aylIGvh9wK7SKImZvZDo?e=rH6fZ4)


## BUSCADOR, FILTRADO o CATEGORIZACIÓN
Se incluirá un Buscador de modelo único para la entidad principal, pudiendo filtrar la búsqueda en función de los atributos que categorizan el producto como la marca, el precio o el deporte.


## Práctica 1

### Capturas de pantalla

#### Página principal
![Página principal (Vista 1)](capturaspantallaP1/PantallaInicio1.png)
![Página principal (Vista 2)](capturaspantallaP1/PantallaInicio2.png)
![Página principal (Vista 3)](capturaspantallaP1/PantallaInicio3.png)

#### Página de detalle
![Página de detalle (Vista 1)](capturaspantallaP1/PantallaProducto1.png)
![Página de detalle (Vista 2)](capturaspantallaP1/PantallaProducto2.png)
![Página de detalle (Vista 1 página de reseñas)](capturaspantallaP1/Reseñas1.png)
![Página de detalle (Vista 2 página de reseñas)](capturaspantallaP1/Reseñas2.png)

#### Página de nuevo elemento
![Formulario de nueva zapatilla](capturaspantallaP1/FormularioNuevaZapatilla.png)

### Participación de los integrantes

#### Raúl Cabezas Vallecillo
En primer lugar, eliminé el botón del carrito que no resultaba necesario para los requisitos de la práctica. Añadí un cuadro de búsqueda en la parte de la cabecera, incluyendo un campo de texto y un botón con un icono de lupa para buscar, que incorporé utilizando boostrap icons.
También desarrollé la pagina de detalle de una de las zapatillas, que al principio sólo incluía imagen, descripción, nombre de la zapatilla, botón de "ver reseñas" y botón de volver a la página principal, pero que más adelante mejoré para añadir stock, id, color, etc; con el objetivo de que cuadrara con el formulario que hizo mi compañero Alejandro de "añadir zapatilla", ya que ambos debían tener los mismos datos. También añadí dos botones de edición y borrado del producto.
También hice la página completa de reseñas, donde se pueden apreciar tres reseñas "falsas" cuyo objetivo es demostrar la forma que tendrán en un futuro cuando realmente las implementemos, con celdas para cada usuario, que incluyen la valoración del usuario con estrellas (que actualmente son texto, no son reales), nombre del usuario, fecha y comentario acerca del producto, tal como se prometió en la entidad secundaria. Más adelante, añadí un formulario completo para que el usuario pudiera añadir sus propias reseñas; pudiendo (y debiendo) añadir el nombre de usuario, fecha, valoración y descripción, con los atributos que consideré más adecuados para rellenar los campos adecuadamente.
Hay otros commits que hice solucionando errores importantes que la rúbrica de la práctica exigía, por ejemplo, añadir la cabecera y pie de página a la pagina de producto y reseñas, corregir un error que cometí con el menú desplegable y el símbolo de la lupa al hacer dicha acción, o corregir la columna con los datos de la zapatilla en la que había un espacio innecesario entre el color y el id.
Por último, cabe mencionar que todo el código que escribí fue debidamente comentado en inglés para su mejor comprensión y todo el código está en dicho idioma(excepto las palabras que vayan a ser visibles para el usuario en la web, lo que resulta evidente), lo que fue posible en parte gracias a la herramienta: Traductor de Google.


**5 commits más significativos:**
- Barra de búsqueda (https://github.com/CodeURJC-FW-2026-27/webapp02/commit/dc4173cf83f21be86e78bada836b66ba57ec4458)
- Desarrollo de página de detalle del producto (https://github.com/CodeURJC-FW-2026-27/webapp02/commit/ae9d9f885d888199877e43132f87c551ed230fad)
- Mejora del producto que incluía marca, precio y tallas (https://github.com/CodeURJC-FW-2026-27/webapp02/commit/2d6db360cc3234c55d379b73c30a4cd2013b6f01)
- Página de producto casi definitiva y pagina de reseñas al completo (https://github.com/CodeURJC-FW-2026-27/webapp02/commit/860d4daa0ac58d08beaafe42a843491e4c5b3eab)
- Corrección de error importante tras añadir cabecera y pie de página que impedía que el menú desplegable y la lupa aparecieran (https://github.com/CodeURJC-FW-2026-27/webapp02/commit/2e2048a127c0a386d13ffe1a5c4692800e30f853)

**5 ficheros en los que más ha participado:**
- [Nombre del fichero 1](URL_DEL_FICHERO)
- [Nombre del fichero 2](URL_DEL_FICHERO)
- [Nombre del fichero 3](URL_DEL_FICHERO)
- [Nombre del fichero 4](URL_DEL_FICHERO)
- [Nombre del fichero 5](URL_DEL_FICHERO)

#### Sergio García García

**Tareas realizadas:**
Párrafo describiendo su trabajo en esta práctica.

**5 commits más significativos:**
- [Todas las Zapatillas](URL_DEL_COMMIT)
- [Hover de las Zapatillas](URL_DEL_COMMIT)
- [Boton Zapatilla(div)](URL_DEL_COMMIT)
- [Poner 3 articulos fila](URL_DEL_COMMIT)
- [Descripción del commit 5](URL_DEL_COMMIT)

**5 ficheros en los que más ha participado:**
- [Index.html](URL_DEL_FICHERO)
- [Productos.html](URL_DEL_FICHERO)
- [Nombre del fichero 3](URL_DEL_FICHERO)
- [Nombre del fichero 4](URL_DEL_FICHERO)
- [Nombre del fichero 5](URL_DEL_FICHERO)

#### Alejandro Rodado López de la Reina

**Tareas realizadas:**
Párrafo describiendo su trabajo en esta práctica.

**5 commits más significativos:**
- [Descripción del commit 1](URL_DEL_COMMIT)
- [Descripción del commit 2](URL_DEL_COMMIT)
- [Descripción del commit 3](URL_DEL_COMMIT)
- [Descripción del commit 4](URL_DEL_COMMIT)
- [Descripción del commit 5](URL_DEL_COMMIT)

**5 ficheros en los que más ha participado:**
- [Nombre del fichero 1](URL_DEL_FICHERO)
- [Nombre del fichero 2](URL_DEL_FICHERO)
- [Nombre del fichero 3](URL_DEL_FICHERO)
- [Nombre del fichero 4](URL_DEL_FICHERO)
- [Nombre del fichero 5](URL_DEL_FICHERO)
