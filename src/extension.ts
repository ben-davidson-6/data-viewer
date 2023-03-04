// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { exec } from "child_process";
import * as vscode from "vscode";
import { GreeterClient } from "./proto/service.client";
import { GrpcTransport } from "@protobuf-ts/grpc-transport";
import { ChannelCredentials } from "@grpc/grpc-js";
import { HelloRequest } from "./proto/service";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "data-viewer" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "data-viewer.start-server",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      let serverScript =
        "C:\\Users\\Benjy\\Documents\\code\\data-viewer\\backend\\rpc_server.py";
      let pythonInterpretter =
        "C:\\Users\\Benjy\\miniconda3\\envs\\vscode-ext\\python.exe";
      let command = `${pythonInterpretter} ${serverScript}`;
      exec(command, (error, stdout, stderr) => {
        console.log(stdout);
        // todo how to tidy this  up
      });
    }
  );

  context.subscriptions.push(disposable);
  disposable = vscode.commands.registerCommand(
    "data-viewer.speak-server",
    () => {
      let transport = new GrpcTransport({
        // this isnt needed?
        host: "localhost:50051",
        channelCredentials: ChannelCredentials.createInsecure(),
      });
      let client = new GreeterClient(transport);
      let req: HelloRequest = { name: "ben" };
      client.sayHello(req).then((resp) => {
        let msg = resp.response.message;
        vscode.window.showInformationMessage(msg);
      });
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
