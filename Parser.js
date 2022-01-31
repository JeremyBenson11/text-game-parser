// This parser will return a parsedCommand object filled with usefull sentence parts and information.
// This is a very simple and lightweight parser that would be great for Browser or Electron/Node.js games. Also graphical text games.
// (opt) means optional word.

// License. 'Creative Commons' User may adapt, sell, provide as is, modify this code, and include in any project (commercial or otherwise.)
// Feel free to leave Jeremy Benson some credit if used.

// this parser may not be gramatically correct, though it works great.
function Parser() {

    this.parsedCommand = {
        "actionType": null,
        "verb": null,
        "indirectObject": null,
        "directObject": null,
        "preposition": null,
        "error": false,
        "errorMessages": {},
        "angledCommand": false,
        "command": ""

    };

    this.prepositionList = ['on',
        'off',
        'under',
        'over',
        'above',
        'around',
        'beside',
        'in',
        'out',
        'down',
        'up',
        'with',
        'across',
        'from',
        'at',
        'to',
        'for',
        'about',
        'open',
        'opened',
        'close',
        'closed',
        'shut'
    ];

    this.commandArray = [];

}

Parser.prototype.parse = function(command) {


    command = command.trim();

    if (this.parsedCommand.angledCommand == false) {
        // commands are fed in like 'get the lamp'

        // if command empty

        if (command === "") {

            this.parsedCommand.errorMessages.emptyCommand = "command empty.";

        }

        // test for illegal character, if so throw error
        let spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

        if (spChars.test(command)) {

            this.parsedCommand.errorMessages.specialCharacter = "command contains illegal character.";

        } else {

            this.parsedCommand.command = command;
            this.commandArray = this.parsedCommand.command.split(" ");

        }

    } else {
        // commands are fed in like <get the lamp>
        // so strip the first and last character of the command

        // test if opening bracket is missing

        let openingBracket, terminatingBracket = false;


        if (command.charAt(0) == '<') {

            openingBracket = true;


        } else {

            this.parsedCommand.errorMessages.openingBracket = "command missing opening bracket";

        }

        // test if terminating bracket is missing
        if (command.charAt(command.length - 1) == '>') {

            terminatingBracket = true;

        } else {

            this.parsedCommand.errorMessages.terminatingBracket = "command missing terminating bracket";

        }

        if (Object.keys(this.parsedCommand.errorMessages).length === 0 &&
            Object.getPrototypeOf(this.parsedCommand.errorMessages) === Object.prototype) {


            this.parsedCommand.command = command.substring(1, command.length - 1);
            this.parsedCommand.command = this.parsedCommand.command.trim();

            let spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.\/?]+/;
            if (spChars.test(this.parsedCommand.command)) {

                this.parsedCommand.errorMessages.specialCharacter = "command contains illegal character.";

            } else {

                if (this.parsedCommand.command === "") {

                    this.parsedCommand.errorMessages.emptyCommand = "command empty.";

                } else {

                    this.commandArray = this.parsedCommand.command.split(" ");

                }
            }

        }

        // end angledCommand process
    }

    if (Object.keys(this.parsedCommand.errorMessages).length === 0 &&
        Object.getPrototypeOf(this.parsedCommand.errorMessages) === Object.prototype) {

        // test command for special character, if so throw error.

        switch (this.commandArray[0]) {

            default:
                // prepositions: (on|under|over|above|around|beside|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)
                // Prepositions help make regex queries unique, due to placement in sentence. Due to this preposition will not be a named capture group.
                //01 <verb> the(opt) <indirectObj> <preposition> the(opt) <directObj> 
                //02 <verb> to the(opt) <indirectObj> <preposition> the(opt) <directObj> 
                //03 <verb> <preposition> the(opt) <directObj> 
                //04 <verb> the(opt) <directObj> <preposition>
                //05 <verb> the(opt) <directObj>
                //06 <verb>

                //01 'push the ball under the table', 'ask the woman about the ball'
                //02 'yell to the woman about the job'
                //03 'push over the statue' 'look under the ledge'
                //04 'twist the cap off' 'jam the door open' 
                //05 'turn the key'
                //06 'dance'

                if (/^(?<verb>[^ $]*)( the) (?<indirectObject>.*?) (on|off|under|over|above|around|beside|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)( the)? (?<directObject>.*?)$/.test(this.parsedCommand.command)) {
                    
                    const matches = /^(?<verb>[^ $]*)( the) (?<indirectObject>.*?) (on|off|under|over|above|around|beside|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)( the) (?<directObject>.*?)$/.exec(this.parsedCommand.command);
                    this.parsedCommand.actionType = "<verb><indirectObject><preposition><directObj>";
                    this.parsedCommand.verb = matches.groups.verb;
                    this.parsedCommand.directObject = matches.groups.directObject;
                    this.parsedCommand.indirectObject = matches.groups.indirectObject;
                    this.parsedCommand.preposition = this.prepositionFetch(this.parsedCommand.command, this.commandArray);
                    //this.parsedCommand.errorMessages.add({"fun error": "This is a test error."});

                } else if (/^(?<verb>[^ $]*)( to)( the) (?<indirectObject>.*?) (on|off|under|over|above|around|beside|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)( the) (?<directObject>.*?)$/.test(this.parsedCommand.command)) {
                    
                    
                    const matches = /^(?<verb>[^ $]*)( to)( the)? (?<indirectObject>.*?) (on|off|under|over|above|around|beside|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)( the) (?<directObject>.*?)$/.exec(this.parsedCommand.command);
                    this.parsedCommand.actionType = "<verb>to<indirectObj><preposition><directObj>";

                    this.parsedCommand.verb = matches.groups.verb;
                    this.parsedCommand.directObject = matches.groups.directObject;
                    this.parsedCommand.indirectObject = matches.groups.indirectObject;
                    this.parsedCommand.preposition = this.prepositionFetch(this.parsedCommand.command, this.commandArray);

                } else if (/^(?<verb>[^ $]*) (on|off|under|over|above|around|beside|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)( the)? (?<directObject>.*?)$/.test(this.parsedCommand.command)) {
                   
                    const matches = /(?<verb>[^ $]*) (on|off|under|over|above|around|beside|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)( the)? (?<directObject>.*?)$/.exec(this.parsedCommand.command);
                    this.parsedCommand.actionType = "<verb><preposition><directObj>";
                    this.parsedCommand.verb = matches.groups.verb;
                    this.parsedCommand.directObject = matches.groups.directObject;
                    this.parsedCommand.preposition = this.prepositionFetch(this.parsedCommand.command, this.commandArray);


                } else if (/^(?<verb>[^ $]*)( the) (?<indirectObject>.*?) (on|off|under|over|above|around|beside|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)$/.test(this.parsedCommand.command)) {

                    const matches = /(?<verb>[^ $]*)( the)? (?<directObject>.*?) (on|off|under|over|above|around|beside|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)/.exec(this.parsedCommand.command);
                    this.parsedCommand.actionType = "<verb><directObj><preposition>";
                    this.parsedCommand.verb = matches.groups.verb;
                    this.parsedCommand.directObject = matches.groups.directObject;
                    this.parsedCommand.preposition = this.prepositionFetch(this.parsedCommand.command, this.commandArray);

                    // this will catch a grammar error
                    // if this is not included a regex will get confuse
                    // 'press the red button the machine' will catch here.
                } else if (/^(?<verb>[^ $]*) the (?<indirectObject>.*?) the (?<directObject>.*?)$/.test(this.parsedCommand.command)) {

                    const matches = /^(?<verb>[^ $]*) the (?<indirectObject>.*?) the (?<directObject>.*?)$/.exec(this.parsedCommand.command);
                    this.parsedCommand.actionType = null;
                    this.parsedCommand.verb = null;
                    this.parsedCommand.indirectObj = null;
                    this.parsedCommand.directObj = null;
                    this.parsedCommand.error = true;
                    this.parsedCommand.errorMessages.gramatical = "a grammar problem in comamnd.";

                } else if (/^(?<verb>[^ $]*)( the)? (?<directObject>.*?)$/.test(this.parsedCommand.command)) {

                    const matches = /^(?<verb>[^ $]*)( the)? (?<directObject>.*?)$/.exec(this.parsedCommand.command);
                    this.parsedCommand.actionType = "<verb><directObj>";
                    this.parsedCommand.verb = matches.groups.verb;
                    this.parsedCommand.directObject = matches.groups.directObject

                } else if (/^(?<verb>[^ $]*)$/.test(this.parsedCommand.command)) {

                    // In this case single word commands may not be verbs, but will be stored in verb.
                    // Ie: 'map' as apposed to 'run'
                    const matches = /(?<verb>[^ $]*)/.exec(this.parsedCommand.command);
                    this.parsedCommand.actionType = "<verb>";
                    this.parsedCommand.verb = matches.groups.verb;

                    // error handle, verb must be one word, not multiword

                    if (this.commandArray.length >= 1) {

                        // there are too many words for this case to be error free, so throw error.
                        //this.parsedCommand.errorMessages.unshift({"verb error":"verb not understood"});
                        this.parsedCommand.actionType = "<verb>";
                        this.parsedCommand.verb = null;
                        this.parsedCommand.indirectObj = null;
                        this.parsedCommand.directObj = null;
                        this.parsedCommand.error = true;

                    }

                }

                // end parse
                break;

        }

    }

    return this.parsedCommand;

    // end parse function
};

// This function will return preposition used in command
// remove function if not needed
Parser.prototype.prepositionFetch = function(command, commandArray) {
    // every command version except 05 and 06 have a preposition.
    let preposition = "";

    for (let i = 0; i <= this.prepositionList.length - 1; i++) {

        if (commandArray.indexOf(this.prepositionList[i]) >= 0) {

            preposition = this.prepositionList[i];

        }

    }

    return preposition;
    // end preposition fetch
}

Parser.prototype.setAngledCommand = function(state) {

    this.parsedCommand.angledCommand = state;

}
