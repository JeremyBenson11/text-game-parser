// This parser will return a parsedCommand object filled with useful sentence parts and information.
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

    this.prepositionList = [
        'in',
        'on',
        'off',
        'under',
        'over',
        'above',
        'around',
        'inside',
        'beside',
        'behind',
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



    if (this.parsedCommand.angledCommand == false) {
        // commands are fed in like 'get the lamp'

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

            let spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.\/?]+/;
            if (spChars.test(this.parsedCommand.command)) {

                this.parsedCommand.errorMessages.specialCharacter = "command contains illegal character.";

            } else {


                this.commandArray = this.parsedCommand.command.split(" ");

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

                //01 <verb><indirectObject><preposition><directObj>
                //02 <verb>to<indirectObj><preposition><directObj>
                //03 <verb><preposition>of<directObj>
                //04 <verb><preposition><directObj>
                //05 <verb><directObjet><preposition>
                //06 will catch a gramatical error
                //07 <verb><indirectObj><preposition><directObj>
                //08 <verb><directObj>

                //01 'push the machine of the cliff' 'push machine off cliff'
                //02 'yell to the lady about the job' 'yell to the at lady about the awful job'
                //03 'look in back of the statue'
                //04 'dance in the rain' 'dance in rain'
                //05 'turn the red knob off'
                //06 'turn the knob the machine' 
                //07 'push top off statue'
                //08 'push the car' 'push car'
                //09 'dance' 'map'

                // BUG: there are not enough optional words. commands must be written in full in top cases. 'yell to the lady about the job' not 'yell to lady about job'
                // BUG: if cases are treated as having optional words regexes get confused.

                if (/^(?<verb>[^ $]*)( the) (?<indirectObject>.*?) (on|off|under|over|above|around|inside|beside|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)( the) (?<directObject>.*?)$/.test(command)) {

                    const matches = /^(?<verb>[^ $]*)( the) (?<indirectObject>.*?) (on|off|under|over|above|around|inside|beside|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)( the) (?<directObject>.*?)$/.exec(command);
                    this.parsedCommand.actionType = "<verb><indirectObject><preposition><directObj>";
                    this.parsedCommand.verb = matches.groups.verb;
                    this.parsedCommand.directObject = matches.groups.directObject;
                    this.parsedCommand.indirectObject = matches.groups.indirectObject;
                    this.parsedCommand.preposition = this.prepositionFetch(command, this.commandArray);
                    //this.parsedCommand.errorMessages.add({"fun error": "This is a test error."});

                } else if (/^(?<verb>[^ $]*)( to)( the) (?<indirectObject>.*?) (on|off|under|over|above|around|inside|beside|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)( the) (?<directObject>.*?)$/.test(command)) {

                    const matches = /^(?<verb>[^ $]*)( to)( the) (?<indirectObject>.*?) (on|off|under|over|above|around|inside|beside|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)( the) (?<directObject>.*?)$/.exec(command);
                    this.parsedCommand.actionType = "<verb>to<indirectObj><preposition><directObj>";

                    this.parsedCommand.verb = matches.groups.verb;
                    this.parsedCommand.directObject = matches.groups.directObject;
                    this.parsedCommand.indirectObject = matches.groups.indirectObject;
                    this.parsedCommand.preposition = this.prepositionFetch(command, this.commandArray);

                } else if (/^(?<verb>[^ $]*) (in|on|off|under|over|above|around|inside|beside|behind|in front|in back|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut) of( the)? (?<directObject>.*?)$/.test(this.parsedCommand.command)) {

                    // this case will capture 'in back' and 'in front' for 'look in back of dresser'
                    // in front and in back are not inluded in preposition list or any other regex.

                    const matches = /^(?<verb>[^ $]*) (in|on|off|under|over|above|around|inside|beside|behind|in front|in back|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut) of( the)? (?<directObject>.*?)$/.exec(this.parsedCommand.command);
                    this.parsedCommand.actionType = "<verb><preposition>of<directObj>";
                    this.parsedCommand.verb = matches.groups.verb;
                    this.parsedCommand.directObject = matches.groups.directObject;

                    if (this.parsedCommand.command.indexOf('in back') >= 1) {

                        this.parsedCommand.preposition = 'in back';

                    } else if (this.parsedCommand.command.indexOf('in front') >= 1) {

                        this.parsedCommand.preposition = 'in front';

                    } else {

                        this.parsedCommand.actionType = null;
                        this.parsedCommand.verb = null;
                        this.parsedCommand.indirectObj = null;
                        this.parsedCommand.directObj = null;
                        this.parsedCommand.error = true;
                        this.parsedCommand.errorMessages.prepositional = "unable to determine preposition.";

                    }

                } else if (/^(?<verb>[^ $]*) (in|on|off|under|over|above|around|inside|beside|behind|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)( the)? (?<directObject>.*?)$/.test(this.parsedCommand.command)) {

                    const matches = /(?<verb>[^ $]*) (in|on|off|under|over|above|around|inside|beside|behind|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)( the)? (?<directObject>.*?)$/.exec(this.parsedCommand.command);
                    this.parsedCommand.actionType = "<verb><preposition><directObj>";
                    this.parsedCommand.verb = matches.groups.verb;
                    this.parsedCommand.directObject = matches.groups.directObject;
                    this.parsedCommand.preposition = this.prepositionFetch(this.parsedCommand.command, this.commandArray);


                } else if (/^(?<verb>[^ $]*)( the) (?<indirectObject>.*?) (in|on|off|under|over|above|around|inside|beside|behind|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)$/.test(this.parsedCommand.command)) {

                    const matches = /(?<verb>[^ $]*)( the)? (?<directObject>.*?) (in|on|off|under|over|above|around|inside|beside|behind|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)/.exec(this.parsedCommand.command);
                    this.parsedCommand.actionType = "<verb><directObj><preposition>";
                    this.parsedCommand.verb = matches.groups.verb;
                    this.parsedCommand.directObject = matches.groups.directObject;
                    this.parsedCommand.preposition = this.prepositionFetch(this.parsedCommand.command, this.commandArray);

                } else if (/^(?<verb>[^ $]*) the (?<indirectObject>.*?) the (?<directObject>.*?)$/.test(this.parsedCommand.command)) {

                    // this will catch a grammar error
                    // if this is not included a regex will get confuse
                    // 'press the red button the machine' will catch here.

                    const matches = /^(?<verb>[^ $]*) the (?<indirectObject>.*?) the (?<directObject>.*?)$/.exec(this.parsedCommand.command);
                    this.parsedCommand.actionType = null;
                    this.parsedCommand.verb = null;
                    this.parsedCommand.indirectObj = null;
                    this.parsedCommand.directObj = null;
                    this.parsedCommand.error = true;
                    this.parsedCommand.errorMessages.gramatical = "a grammar problem in comamnd.";

                } else if (/^(?<verb>[^ $]*) (?<indirectObject>.*?) (on|off|under|over|above|around|inside|beside|behind|down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)( the)? (?<directObject>.*?)$/.test(this.parsedCommand.command)) {

                    const matches = /^(?<verb>[^ $]*) (?<indirectObject>.*?) (on|off|under|over|above|around|inside|beside|behind||down|up|with|across|from|at|to|for|about|open|opened|close|closed|shut)( the)? (?<directObject>.*?)$/.exec(this.parsedCommand.command);
                    this.parsedCommand.actionType = "<verb><indirectObj><preposition><directObj>";
                    this.parsedCommand.verb = matches.groups.verb;
                    this.parsedCommand.directObject = matches.groups.directObject;
                    this.parsedCommand.indirectObject = matches.groups.indirectObject;
                    this.parsedCommand.preposition = this.prepositionFetch(this.parsedCommand.command, this.commandArray);

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
