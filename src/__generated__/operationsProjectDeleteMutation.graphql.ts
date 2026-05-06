/**
 * @generated SignedSource<<e1b3605a3c5bc0197206931b28f410b7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type operationsProjectDeleteMutation$variables = {
  id: string;
};
export type operationsProjectDeleteMutation$data = {
  readonly projectDelete: boolean;
};
export type operationsProjectDeleteMutation = {
  response: operationsProjectDeleteMutation$data;
  variables: operationsProjectDeleteMutation$variables;
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
    "name": "projectDelete",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "operationsProjectDeleteMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "operationsProjectDeleteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1e1d4a0972fd7b8da5d2586406230cd5",
    "id": null,
    "metadata": {},
    "name": "operationsProjectDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation operationsProjectDeleteMutation(\n  $id: String!\n) {\n  projectDelete(id: $id)\n}\n"
  }
};
})();

(node as any).hash = "4eccd154a23aa3fa73e0a79f09ad0336";

export default node;
