export default class CxChat {
  conversationId: string;
  responses: string[];

  constructor(conversationId: string, responses: string[]) {
    this.conversationId = conversationId;
    this.responses = responses;
  }

  static parseChat(resultObject: any): CxChat {
    return new CxChat(resultObject.conversationId, resultObject.response);
  }
}
