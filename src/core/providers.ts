export interface ModelProvider{complete(input:string):Promise<string>}
export interface SearchProvider{search(query:string):Promise<unknown>}
export interface VoiceProvider{startSession(context:unknown):Promise<unknown>}
export interface EmailProvider{send(input:unknown):Promise<unknown>}
export interface CalendarProvider{createEvent(input:unknown):Promise<unknown>}
export interface BlockchainProvider{execute(input:unknown):Promise<unknown>}
