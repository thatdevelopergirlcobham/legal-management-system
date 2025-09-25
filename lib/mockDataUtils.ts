// "use server"
import { IUser, ICase, IAppointment, IDocument, IChatMessage } from './mockData';

export function userToPlain(user: IUser) {
  const {  ...plainUser } = user;
  return {
    ...plainUser,
    _id: plainUser._id,
    id: plainUser._id,
    createdAt: plainUser.createdAt?.toISOString(),
    updatedAt: plainUser.updatedAt?.toISOString()
  };
}

export function caseToPlain(case_: ICase) {
  return {
    ...case_,
    id: case_._id,
    createdAt: case_.createdAt?.toISOString(),
    updatedAt: case_.updatedAt?.toISOString()
  };
}

export function appointmentToPlain(appointment: IAppointment) {
  return {
    ...appointment,
    id: appointment._id,
    date: appointment.date.toISOString(),
    createdAt: appointment.createdAt?.toISOString(),
    updatedAt: appointment.updatedAt?.toISOString()
  };
}

export function documentToPlain(document: IDocument) {
  return {
    ...document,
    id: document._id,
    uploadedAt: document.uploadedAt.toISOString(),
    createdAt: document.createdAt?.toISOString(),
    updatedAt: document.updatedAt?.toISOString()
  };
}

export function chatMessageToPlain(message: IChatMessage) {
  return {
    ...message,
    id: message._id,
    timestamp: message.timestamp.toISOString(),
    createdAt: message.createdAt?.toISOString(),
    updatedAt: message.updatedAt?.toISOString()
  };
}