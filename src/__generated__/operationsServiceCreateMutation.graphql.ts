/**
 * @generated SignedSource<<b6c32ab2899a55abe8dde94d6a2dad1f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ServiceCreateInput = {
  branch?: string | null | undefined;
  environmentId?: string | null | undefined;
  icon?: string | null | undefined;
  name?: string | null | undefined;
  projectId: string;
  registryCredentials?: RegistryCredentialsInput | null | undefined;
  source?: ServiceSourceInput | null | undefined;
  templateId?: string | null | undefined;
  templateServiceId?: string | null | undefined;
  variables?: any | null | undefined;
};
export type RegistryCredentialsInput = {
  password: string;
  username: string;
};
export type ServiceSourceInput = {
  image?: string | null | undefined;
  repo?: string | null | undefined;
};
export type operationsServiceCreateMutation$variables = {
  input: ServiceCreateInput;
};
export type operationsServiceCreateMutation$data = {
  readonly serviceCreate: {
    readonly createdAt: any;
    readonly icon: string | null | undefined;
    readonly id: string;
    readonly name: string;
    readonly projectId: string;
    readonly templateId: string | null | undefined;
    readonly templateServiceId: string | null | undefined;
  };
};
export type operationsServiceCreateMutation = {
  response: operationsServiceCreateMutation$data;
  variables: operationsServiceCreateMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "Service",
    "kind": "LinkedField",
    "name": "serviceCreate",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "icon",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "projectId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "templateId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "templateServiceId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "createdAt",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "operationsServiceCreateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "operationsServiceCreateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2214bbb612d8aa8194cac49df9c62df7",
    "id": null,
    "metadata": {},
    "name": "operationsServiceCreateMutation",
    "operationKind": "mutation",
    "text": "mutation operationsServiceCreateMutation(\n  $input: ServiceCreateInput!\n) {\n  serviceCreate(input: $input) {\n    id\n    name\n    icon\n    projectId\n    templateId\n    templateServiceId\n    createdAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "3dfbdb8554d6cdc91c8ae34baff14ce9";

export default node;
