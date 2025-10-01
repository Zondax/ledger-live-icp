var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var index_idl_exports = {};
__export(index_idl_exports, {
  idlFactory: () => idlFactory,
  init: () => init
});
module.exports = __toCommonJS(index_idl_exports);
const idlFactory = ({ IDL }) => {
  const InitArg = IDL.Record({ "ledger_id": IDL.Principal });
  const GetAccountIdentifierTransactionsArgs = IDL.Record({
    "max_results": IDL.Nat64,
    "start": IDL.Opt(IDL.Nat64),
    "account_identifier": IDL.Text
  });
  const Tokens = IDL.Record({ "e8s": IDL.Nat64 });
  const TimeStamp = IDL.Record({ "timestamp_nanos": IDL.Nat64 });
  const Operation = IDL.Variant({
    "Approve": IDL.Record({
      "fee": Tokens,
      "from": IDL.Text,
      "allowance": Tokens,
      "expected_allowance": IDL.Opt(Tokens),
      "expires_at": IDL.Opt(TimeStamp),
      "spender": IDL.Text
    }),
    "Burn": IDL.Record({
      "from": IDL.Text,
      "amount": Tokens,
      "spender": IDL.Opt(IDL.Text)
    }),
    "Mint": IDL.Record({ "to": IDL.Text, "amount": Tokens }),
    "Transfer": IDL.Record({
      "to": IDL.Text,
      "fee": Tokens,
      "from": IDL.Text,
      "amount": Tokens,
      "spender": IDL.Opt(IDL.Text)
    })
  });
  const Transaction = IDL.Record({
    "memo": IDL.Nat64,
    "icrc1_memo": IDL.Opt(IDL.Vec(IDL.Nat8)),
    "operation": Operation,
    "timestamp": IDL.Opt(TimeStamp),
    "created_at_time": IDL.Opt(TimeStamp)
  });
  const TransactionWithId = IDL.Record({
    "id": IDL.Nat64,
    "transaction": Transaction
  });
  const GetAccountIdentifierTransactionsResponse = IDL.Record({
    "balance": IDL.Nat64,
    "transactions": IDL.Vec(TransactionWithId),
    "oldest_tx_id": IDL.Opt(IDL.Nat64)
  });
  const GetAccountIdentifierTransactionsError = IDL.Record({
    "message": IDL.Text
  });
  const GetAccountIdentifierTransactionsResult = IDL.Variant({
    "Ok": GetAccountIdentifierTransactionsResponse,
    "Err": GetAccountIdentifierTransactionsError
  });
  const Account = IDL.Record({
    "owner": IDL.Principal,
    "subaccount": IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const GetAccountTransactionsArgs = IDL.Record({
    "max_results": IDL.Nat,
    "start": IDL.Opt(IDL.Nat),
    "account": Account
  });
  const GetBlocksRequest = IDL.Record({
    "start": IDL.Nat,
    "length": IDL.Nat
  });
  const GetBlocksResponse = IDL.Record({
    "blocks": IDL.Vec(IDL.Vec(IDL.Nat8)),
    "chain_length": IDL.Nat64
  });
  const HttpRequest = IDL.Record({
    "url": IDL.Text,
    "method": IDL.Text,
    "body": IDL.Vec(IDL.Nat8),
    "headers": IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))
  });
  const HttpResponse = IDL.Record({
    "body": IDL.Vec(IDL.Nat8),
    "headers": IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    "status_code": IDL.Nat16
  });
  const Status = IDL.Record({ "num_blocks_synced": IDL.Nat64 });
  return IDL.Service({
    "get_account_identifier_balance": IDL.Func(
      [IDL.Text],
      [IDL.Nat64],
      ["query"]
    ),
    "get_account_identifier_transactions": IDL.Func(
      [GetAccountIdentifierTransactionsArgs],
      [GetAccountIdentifierTransactionsResult],
      ["query"]
    ),
    "get_account_transactions": IDL.Func(
      [GetAccountTransactionsArgs],
      [GetAccountIdentifierTransactionsResult],
      ["query"]
    ),
    "get_blocks": IDL.Func([GetBlocksRequest], [GetBlocksResponse], ["query"]),
    "http_request": IDL.Func([HttpRequest], [HttpResponse], ["query"]),
    "icrc1_balance_of": IDL.Func([Account], [IDL.Nat64], ["query"]),
    "ledger_id": IDL.Func([], [IDL.Principal], ["query"]),
    "status": IDL.Func([], [Status], ["query"])
  });
};
const init = ({ IDL }) => {
  const InitArg = IDL.Record({ "ledger_id": IDL.Principal });
  return [InitArg];
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  idlFactory,
  init
});
