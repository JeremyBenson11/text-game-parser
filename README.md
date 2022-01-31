# text-game-parser
A very light-weight and simple text game parser for all.
# declarations

			// Parser needs a command to work with
			// set angledCommand with Parser.setAngledCommand(true) if commands are '<get lamp>' as apposed to 'get lamp'

			let command = "";

			Parser = new Parser();
			Parser.setAngledCommand(false);
			// parsing a command will return json data
			// "actionType" -> One of six action types to make action handling easier
			//"verb" -> The verb being used
			// "indirectObject" -> The indirect object in the pattern.
			//"directObject"  -> The direct object in the pattern
			//"preposition" -> Any preposition being used in the command
			//"error" -> true if parsing errors found.
			//"errorMessages" -> Json of errors.
			//"angledCommand" -> true/false
			//"command" -> The entire command sentence.

			//01 'push the ball under the table', 'ask the woman about the ball'
			//02 'yell to the woman about the job', even 'yell woman about job'
			//03 'push over the statue' 'look under the ledge'
			//04 'twist the cap off' 'jam the door open' 
			//05 'turn the key'
			//06 'dance'

			// possible errors in "errorMessages"
			// this.parsedCommand.errorMessages.specialCharacter = "command contains illegal character." (thrown when items contain illegal characters.)
			// this.parsedCommand.errorMessages.openingBracket = "command missing opening bracket"; (angledCommand set to true, missing opening bracket.)
			// this.parsedCommand.errorMessages.terminatingBracket = "command missing terminating bracket"; (angledCommand set to true, missing terminating bracket.)

			// easily white list characters for commands such as '-' to allow dash in item names.
			// update spChars by removing the allowed character. Be careful with angled brackets.

			let parsedCommand = Parser.parse(command);
			console.log(parsedCommand);

			// This is where you could have an action class
			// switch case test for verb, or actionType and handle action.
# update command
here's an example:
			
			  let command = "push the blue button on the red machine";

# notes

This is a work in progress. There may still be issues.
