import { App, } from "cdktf";
import { MainStack } from "./lib/stack";
import { AWSRegion } from "./lib/constants/regions";



const app = new App();
const environments = [{
  envName: "stage",
},
  {
    envName: "prod",
  }
]

environments.forEach((env) => {
  new MainStack(app, `cdk-test-${env.envName}`, {env: { region: AWSRegion.USEast1, acccountID: ""}});
})
app.synth();
