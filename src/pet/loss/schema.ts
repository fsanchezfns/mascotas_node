"use strict";

import * as mongoose from "mongoose";

export interface ILoss extends mongoose.Document {
    description: string;
    date: Date;
    picture: string;
    phone: string;
    state: string;
    pet: mongoose.Schema.Types.ObjectId;
    updated: Number;
    created: Number;
    enabled: Boolean;
}



/**
 * Esquema de Mascotas
 */
export let LossSchema = new mongoose.Schema({
    description: {
        type: String,
        default: "",
        trim: true,
        required: "La descripción es requerida"
    },
    date: {
        type: Date,
        default: "",
        trim: true
    },
    picture: {
        type: String,
        ref: "Image"
    },
    phone: {
        type: String,
        default: "",
        trim: true
    },
    state: {
        type: String,
        enum: ["LOST", "FIND"],
        default: "LOST",
        trim: true
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: "La mascota es requerida"
    },
    updated: {
        type: Date,
        default: Date.now()
    },
    created: {
        type: Date,
        default: Date.now()
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, { collection: "losses" });

/**
 * Antes de guardar
 */
LossSchema.pre("save", function (this: ILoss, next) {
    this.updated = Date.now();

    next();
});

export let Loss = mongoose.model<ILoss>("Loss", LossSchema);