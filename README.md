# text-game-parser
A very lightweight and simple text game parser for all. Let's talk about why a parser like this would matter. A dictionary over millions of records would take 2 seconds to parse until hardware is upgraded. This parser can parse in seconds for a game scaled to any size.
# declarations

			// Parser needs a command to work with
			// set angledCommand with Parser.setAngledCommand(true) if commands are '<get lamp>' as opposed to 'get lamp'

			let command = "".replace(/\s+/g, ' ').trim();

			Parser = new Parser();
			Parser.setAngledCommand(false);
			// parsing a command will return JSON data
			// "actionType" -> One of eight action types to make action handling easier
			//"verb" -> The verb being used
			// "indirectObject" -> The indirect object in the pattern.
			//"directObject"  -> The direct object in the pattern
			//"preposition" -> Any preposition being used in the command
			//"error" -> true if parsing errors are found.
			//"errorMessages" -> Json of errors.
			//"angledCommand" -> true/false
			//"command" -> The entire command sentence.

			//01 'push the machine off the cliff' 'push machine off cliff'
		        //02 'yell to the lady about the job' 'yell to the fat lady about the awful job'
			//03 'look in back of the statue'
			//04 'dance in the rain' 'dance in rain'
			//05 'turn the red knob off'
			//06 'turn the knob the machine' 
			//07 'push top off statue'
			//08 'push the car' 'push car'
			//09 'dance' 'map'

			// possible errors in "errorMessages"
			// this.parsedCommand.errorMessages.specialCharacter = "command contains illegal character." (thrown when items contain illegal characters.)
			// this.parsedCommand.errorMessages.openingBracket = "command missing opening bracket"; (angledCommand set to true, missing opening bracket.)
			// this.parsedCommand.errorMessages.terminatingBracket = "command missing terminating bracket"; (angledCommand set to true, missing terminating bracket.)
			// this.parsedCommand.errorMessages.gramatical = "a grammar problem in comamnd."; ('push the button the machine'.)

			// easily whitelist characters for commands such as '-' to allow dash in item names.
			// update spChars by removing the allowed character. Be careful with angled brackets.

			let parsedCommand = Parser.parse(command);
			console.log(parsedCommand);

			// This is where you could have an action class
			// switch case test for verb, or actionType and handle action.
			// modify database, ect.
# update command
here's an example:
			
			  let command = "push the blue button on the red machine";

# notes

Simple Parser has a nuanced design that would not allow certain prepositions in item names. 
