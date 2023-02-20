
/**
* @swagger
* /api/admin/v1/appHome:
*   get:
*     tags:
*       - Admin controller
*     name: category
*     summary: category admin data
*     consumes:
*       - application/json
*      
*     responses:
*       200:
*         description: Success
*       401:
*         description: Bad Request
*/

/**
* @swagger
* /api/admin/v1/gettown:
*   get:
*     tags:
*       - Admin controller
*     name: TOWN
*     summary: town admin data
*     consumes:
*       - application/json
*     parameters:
*       - in: query
*         name: type
*         schema:
*           type: string
*         required: true
*         description: type is town  
*     responses:
*       200:
*         description: Success
*       401:
*         description: Bad Request
*/

/**
* @swagger
* /api/admin/v1/appHome1:
*   get:
*     tags:
*       - Admin controller
*     name: category
*     summary: category admin data
*     consumes:
*       - application/json
*      
*     responses:
*       200:
*         description: Success
*       401:
*         description: Bad Request
*/