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
 * @api {post} /v1/pet/:petId/loss  Crear loss
 * @apiName Crear Aviso
 * @apiGroup Loss
 *
 * @apiDescription Crea un aviso de perdida.
 *
 * @apiExample {json} Mascota
 *    {
 *      "id": "Id mascota"
 *    }
 *
 * @apiUse IMascotaResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 **/
async function create(req: ISessionRequest, res: express.Response) {
    const result = await service.create(req.user.user_id, req.params.petId, req.body);
    res.json(result)
  }

async function findByPet(req: ISessionRequest, res: express.Response) {
    const result = await service.findByPet(req.params.petId);
    res.json(result.map(dto => {
      return {
        id: dto.id,
        description: dto.description,
        date: dto.date,
        state: dto.state
      };
    }));
  } 

  async function findByPetAndId(req: ISessionRequest, res: express.Response) {
    const result = await service.findByPetAndId(req.params.petId,req.params.lossId);
    res.json(result)
  }

  async function update(req: ISessionRequest, res: express.Response) {
    const result = await service.update(req.user.user_id,req.params.petId,req.params.lossId,req.body);
    res.json(result)
  }

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

  async function findById(req: ISessionRequest, res: express.Response) {
    const result = await service.findById(req.params.lossId);
    res.json(result)
  }