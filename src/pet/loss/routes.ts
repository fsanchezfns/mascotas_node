"use strict";

import * as express from "express";
import { onlyLoggedIn } from "../../token/passport";
import { ISessionRequest } from "../../user/service";
import * as service from "./service";



export function initModule(app: express.Express) {
 
  app
    .route("/v1/pet/:petId/loss")  
    .post(onlyLoggedIn, create)
    .get(onlyLoggedIn, findByPet);
    
    app
    .route("/v1/pet/:petId/loss/:lossId")  
    .get(onlyLoggedIn, findByPetAndId)
    .put(onlyLoggedIn, update);


    app
    .route("/v1/loss")  
    .get(onlyLoggedIn, findAll);

    app
    .route("/v1/loss/:lossId")  
    .get(onlyLoggedIn, findById);
}


/**
* @apiDefine LossRequest
*
* @apiExample {json} Loss
*    {
*      "description": "Descripción del aviso",
*      "date": "fecha de perdida (DD/MM/YYYY)",
*      "picture": "imagen mas reciente",
*      "phone": "telefono de contacto",
*    }
*/
/**
* @apiDefine LossRequestWithState
*
* @apiExample {json} Loss
*    {
*      "description": "Descripción del aviso",
*      "date": "fecha de perdida (DD/MM/YYYY)",
*      "picture": "imagen mas reciente",
*      "phone": "telefono de contacto",
*      "state": "[LOST/FIND]"
*    }
*/

/**
* @apiDefine ILossBasicResponse
*
* @apiSuccessExample {json} Loss
*    {
*      "id": "Id del aviso de perdida",
*      "description": "Descripción del aviso",
*      "date": "fecha de perdida (DD/MM/YYYY)",
*      "picture": "imagen mas reciente",
*      "phone": "telefono de contacto",
*      "state": "[LOST/FIND]"
*    }
*/


/**
* @apiDefine ILossFullResponse
*
* @apiSuccessExample {json} Loss
*    {
*      "id": "Id del aviso de perdida",
*      "description": "Descripción del aviso",
*      "date": "fecha de perdida (DD/MM/YYYY)",
*      "picture": "imagen mas reciente",
       "phone": "telefono de contacto",
       "state": "[LOST/FIND]"
       "pet":{
         "name": "nombre de mascota ",
         "birthDate":"date (DD/MM/YYYY)",
         "description":"descripción de mascota"
       }
*    }
*/
/**



/**
 * @api {post} /v1/pet/:petId/loss  Crear avisos de mascota perdida
 * @apiName Crear Aviso
 * @apiGroup Mascota Perdida
 *
 * @apiDescription Crea un aviso de mascota perdida.
 * @apiUse LossRequest
 *
 * @apiUse ILossBasicResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 **/

async function create(req: ISessionRequest, res: express.Response) {
    const result = await service.create(req.user.user_id, req.params.petId, req.body);
    res.json(result)
  }


/**
 * @api {get} /v1/pet/:petId/loss  Listar avisos de mascota
 * @apiName Listar Avisos de mascota
 * @apiGroup Mascota Perdida
 *
 * @apiDescription Listar avisos de mascota.
 *
 * @apiUse ILossBasicResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 **/

async function findByPet(req: ISessionRequest, res: express.Response) {
    const result = await service.findByPet(req.params.petId);
    res.json(result.map(dto => {
      return {
        id: dto.id,
        description: dto.description,
        picture : dto.picture,
        phone: dto.phone,
        date: dto.date,
        state: dto.state
      };
    }));
  } 


  /**
 * @api {get} /v1/pet/:petId/loss/:lossId  Listar un aviso de mascota
 * @apiName Listar un Aviso de mascota
 * @apiGroup Mascota Perdida
 *
 * @apiDescription Listar un aviso de mascota.
 *
 * @apiUse ILossFullResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 **/

  async function findByPetAndId(req: ISessionRequest, res: express.Response) {
    const result = await service.findByPetAndId(req.params.petId,req.params.lossId);
    res.json(result)
  }



/**
 * @api {put} /v1/pet/:petId/loss/:lossId  Actualizar un aviso de mascota perdida
 * @apiName Actualizar Aviso
 * @apiGroup Mascota Perdida
 *
 * @apiDescription Actualizar un aviso de mascota perdida.
 * @apiUse LossRequestWithState
 *
 * @apiUse ILossBasicResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 **/

  async function update(req: ISessionRequest, res: express.Response) {
    const result = await service.update(req.user.user_id,req.params.petId,req.params.lossId,req.body);
    res.json(result)
  }


  /**
 * @api {get} /v1/lossId  Listar todos los avisos de todas las mascotas
 * @apiName Listar Aviso
 * @apiGroup Mascota Perdida
 *
 * @apiDescription Listar todos los avisos
 *
 * @apiUse ILossBasicResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 **/
  async function findAll(req: ISessionRequest, res: express.Response) {
    const result = await service.findAll();
    res.json(result.map(dto => {
      return {
        id: dto.id,
        description: dto.description,
        date: dto.date,
        state: dto.state
      };
    }));
  }

    /**
 * @api {get} /v1/lossId/:id  Lista el detalle de un aviso
 * @apiName Listar Aviso en detalle
 * @apiGroup Mascota Perdida
 *
 * @apiDescription Listar un aviso en detalle
 *
 * @apiUse ILossFullResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 **/

  async function findById(req: ISessionRequest, res: express.Response) {
    const result = await service.findById(req.params.lossId);
    res.json(result)
  }