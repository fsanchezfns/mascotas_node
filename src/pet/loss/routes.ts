"use strict";

import * as express from "express";
import { ISessionRequest } from "../../user/service";
import * as service from "./service";


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

export async function create(req: ISessionRequest, res: express.Response) {
    console.log('vamos por aca todo piola perro')
    console.log(req.params.petId)
    console.log(req.body)
    const result = await service.create(req.user.user_id, req.params.petId, req.body);
    res.json({
      id: result.id
    });
  }