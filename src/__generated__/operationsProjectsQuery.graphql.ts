/**
 * @generated SignedSource<<0ee3379f271c8bed844312e3a37ecd3e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type operationsProjectsQuery$variables = Record<PropertyKey, never>;
export type operationsProjectsQuery$data = {
  readonly me: {
    readonly email: string;
    readonly id: string;
    readonly name: string | null | undefined;
    readonly workspaces: ReadonlyArray<{
      readonly id: string;
      readonly name: string;
      readonly projects: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly description: string | null | undefined;
            readonly environments: {
              readonly edges: ReadonlyArray<{
                readonly node: {
                  readonly id: string;
                  readonly name: string;
                };
              }>;
            };
            readonly id: string;
            readonly name: string;
            readonly services: {
              readonly edges: ReadonlyArray<{
                readonly node: {
                  readonly icon: string | null | undefined;
                  readonly id: string;
                  readonly name: string;
                  readonly updatedAt: any;
                };
              }>;
            };
            readonly updatedAt: any;
          };
        }>;
      };
    }>;
  };
};
export type operationsProjectsQuery = {
  response: operationsProjectsQuery$data;
  variables: operationsProjectsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 50
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "me",
    "plural": false,
    "selections": [
      (v0/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "email",
        "storageKey": null
      },
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Workspace",
        "kind": "LinkedField",
        "name": "workspaces",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "WorkspaceProjectsConnection",
            "kind": "LinkedField",
            "name": "projects",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "WorkspaceProjectsConnectionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Project",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v0/*: any*/),
                      (v1/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "description",
                        "storageKey": null
                      },
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "first",
                            "value": 20
                          }
                        ],
                        "concreteType": "ProjectEnvironmentsConnection",
                        "kind": "LinkedField",
                        "name": "environments",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ProjectEnvironmentsConnectionEdge",
                            "kind": "LinkedField",
                            "name": "edges",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Environment",
                                "kind": "LinkedField",
                                "name": "node",
                                "plural": false,
                                "selections": [
                                  (v0/*: any*/),
                                  (v1/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "environments(first:20)"
                      },
                      {
                        "alias": null,
                        "args": (v2/*: any*/),
                        "concreteType": "ProjectServicesConnection",
                        "kind": "LinkedField",
                        "name": "services",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ProjectServicesConnectionEdge",
                            "kind": "LinkedField",
                            "name": "edges",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Service",
                                "kind": "LinkedField",
                                "name": "node",
                                "plural": false,
                                "selections": [
                                  (v0/*: any*/),
                                  (v1/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "icon",
                                    "storageKey": null
                                  },
                                  (v3/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "services(first:50)"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "projects(first:50)"
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "operationsProjectsQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "operationsProjectsQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "b1000b5d0f6db9a91af84631c9512b04",
    "id": null,
    "metadata": {},
    "name": "operationsProjectsQuery",
    "operationKind": "query",
    "text": "query operationsProjectsQuery {\n  me {\n    id\n    email\n    name\n    workspaces {\n      id\n      name\n      projects(first: 50) {\n        edges {\n          node {\n            id\n            name\n            description\n            updatedAt\n            environments(first: 20) {\n              edges {\n                node {\n                  id\n                  name\n                }\n              }\n            }\n            services(first: 50) {\n              edges {\n                node {\n                  id\n                  name\n                  icon\n                  updatedAt\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "778ac447c997a75c91d61a2a6822e04c";

export default node;
