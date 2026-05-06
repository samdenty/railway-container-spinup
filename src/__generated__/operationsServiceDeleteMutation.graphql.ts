/**
 * @generated SignedSource<<dcd96fbe98281b84627358670a358a70>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type operationsServiceDeleteMutation$variables = {
  id: string;
};
export type operationsServiceDeleteMutation$data = {
  readonly serviceDelete: boolean;
};
export type operationsServiceDeleteMutation = {
  response: operationsServiceDeleteMutation$data;
  variables: operationsServiceDeleteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "kind": "ScalarField",
    "name": "serviceDelete",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "operationsServiceDeleteMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "operationsServiceDeleteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "87d98fcbf14318f39b69f4523226f00a",
    "id": null,
    "metadata": {},
    "name": "operationsServiceDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation operationsServiceDeleteMutation(\n  $id: String!\n) {\n  serviceDelete(id: $id)\n}\n"
  }
};
})();

(node as any).hash = "6d929d986ba0eb7b64a38bb5604805ec";

export default node;
