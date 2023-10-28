import { Construct } from "constructs";
import { AWSStack, AwsStackProps } from "./Stack/Stack";
import { Lambda } from "./lambda/Function";

type MainStackProps = {
} & AwsStackProps

export class MainStack extends AWSStack {

  constructor(scope: Construct, id: string, props: MainStackProps) {
    super(scope, id, props);
    
    new Lambda(this, "lambda", {
        functionName: "testFn",
    })
    // define resources here
  }
}