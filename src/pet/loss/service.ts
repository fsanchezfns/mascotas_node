"use strict";

import * as error from "../../server/error";
import { ILoss, Loss } from "./schema";
import * as servicePet from "../service";
import { IPet } from "../schema";

const mongoose = require("mongoose");

interface ILossBasic {
  id: string;
  description: string;
  date: Date;
  picture: string;
  phone: string;
  state: string;
}

interface ILossFull {
  id: string;
  description: string;
  date: Date;
  picture: string;
  phone: string;
  state: string;
  pet: {
    name: string;
    birthDate: Date;
    description: string;
  }
}

export async function create(userId: string, petId: string, body: ILoss): Promise<ILossBasic> {
  try {
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
    const lossBasic = formatILossBasic(loss)
    return Promise.resolve(lossBasic);
  } catch (err) {
    return Promise.reject(err);
  }
}


export async function findByPet(petId: string): Promise<Array<ILoss>> {
  try {
    const result = await Loss.find({
      pet: mongoose.Types.ObjectId(petId),
    }).exec();

    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function findByPetAndId(petId: string, lossId: string): Promise<ILossFull> {
  try {
    const loss = await Loss.findOne({
      _id: lossId,
      pet: mongoose.Types.ObjectId(petId),
    }).exec();
    if (!loss) {
      throw error.newError(error.ERROR_NOT_FOUND, "El aviso no se encuentra");
    }

    const pet = await servicePet.find(petId)
    const lossfull = formatILossFull(loss, pet)

    return Promise.resolve(lossfull);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function update(userId: string, petId: string, lossId: string, body: ILoss): Promise<ILossBasic> {
  try {
    //pet del user
    await validatePet(userId, petId)

    const loss = await Loss.findOne({
      _id: lossId,
      pet: mongoose.Types.ObjectId(petId),
    }).exec();
    if (!loss) {
      throw error.newError(error.ERROR_NOT_FOUND, "El aviso no se encuentra");
    }

    if (loss.state == 'FIND') {
      throw error.newError(error.ERROR_NOT_FOUND, "La mascota ya fue encontrada");
    }


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

    const lossBasic = formatILossBasic(loss)
    return Promise.resolve(lossBasic);
  } catch (err) {
    return Promise.reject(err);
  }
}



export async function findAll(): Promise<Array<ILoss>> {
  try {
    const result = await Loss.find({}).exec();
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function findById(lossId: string): Promise<ILossFull> {
  try {
    const loss = await Loss.findOne({
      _id: lossId,
    }).exec();
    const petId = String(loss.pet)
    const pet = await servicePet.find(petId)

    const lossfull = formatILossFull(loss, pet)
    return Promise.resolve(lossfull);
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

    //si encuentra una en estado LOST no puede crear
    if (res) {
      result.messages.push({ path: "description", message: "La mascota ya tiene un aviso de pérdida" });
      return Promise.reject(result)
    } 

    return;
  } catch(err) {
    return Promise.reject(err);
  }
}

async function findByPedIdAndState(petId: string, state: string): Promise<ILoss> {
  try {
    const result = await Loss.findOne({
      pet: mongoose.Types.ObjectId(petId),
      state: state
    }).exec();

    return Promise.resolve(result);
  } catch (err) {

    return Promise.reject(err);
  }
}




async function formatILossBasic(loss: ILoss): Promise<ILossBasic> {
  const lossBasic: ILossBasic = {
    id: loss.id,
    description: loss.description,
    date: loss.date,
    picture: loss.picture,
    phone: loss.phone,
    state: loss.state,
  }

  return lossBasic;
}

async function formatILossFull(loss: ILoss, pet: IPet): Promise<ILossFull> {
  const lossfull: ILossFull = {
    id: loss.id,
    description: loss.description,
    date: loss.date,
    picture: loss.picture,
    phone: loss.phone,
    state: loss.state,
    pet: {
      name: pet.name,
      birthDate: pet.birthDate,
      description: pet.description
    },
  }

  return lossfull;
}
