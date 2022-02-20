"use strict";

import * as error from "../../server/error";
import { ILoss, Loss } from "./schema";
import * as servicePet from "../service";
import { MongoStore } from "connect-mongo";


const mongoose = require("mongoose");


export async function create(userId: string, petId: string, body: ILoss): Promise<ILoss> {
  try {
    console.log(userId)
    //pet del user
    await validatePet(userId, petId)

    await isPetLost(petId)

    let loss: ILoss;
    loss = new Loss();
    loss.pet = mongoose.Types.ObjectId.createFromHexString(petId);

    const validBody = await validateUpdate(body);
    if (validBody.description) {
      loss.description = validBody.description;
    }
    if (validBody.date) {
      loss.date = validBody.date;
    }
    if (validBody.picture) {
      loss.picture = validBody.picture;
    }
    if (validBody.phone) {
      loss.phone = validBody.phone;
    }
    if (validBody.state) {
      loss.state = validBody.state;
    }

    await loss.save();
    return Promise.resolve(loss);
  } catch (err) {
    return Promise.reject(err);
  }
}


async function validateUpdate(body: ILoss): Promise<ILoss> {
  const result: error.ValidationErrorMessage = {
    messages: []
  };

  if (body.description && body.description.length > 1024) {
    result.messages.push({ path: "description", message: "Hasta 1014 caracteres solamente." });
  }

  if (result.messages.length > 0) {
    return Promise.reject(result);
  }

  return Promise.resolve(body);
}


async function validatePet(userId: string, petId: string): Promise<void> {
  const result: error.ValidationErrorMessage = {
    messages: []
  };
  try {
    const pet = await servicePet.findById(userId, petId);
    return

  } catch {

    result.messages.push({ path: "user or pet not found", message: "userId or petId incorrecto" });
    return Promise.reject(result);
  }
}

async function isPetLost(petId: string): Promise<void> {
  const result: error.ValidationErrorMessage = {
    messages: []
  };

  try {
    const res = await findByPedIdAndState(petId, 'LOST')
    result.messages.push({ path: "pet is lost", message: `La mascota ya tiene un aviso de perdida con el id ${res.id}` });

    return Promise.reject(result);
  } catch {
   return
  }
}

async function findByPedIdAndState(petId: string, state: string): Promise<ILoss> {
  try {
    const result = await Loss.findOne({
      pet: mongoose.Types.ObjectId(petId),
      state: state
    }).exec();
    console.log('estoy en pet find by');
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}