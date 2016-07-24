'use babel';

import {exec} from 'child_process';

// Package settings
import meta from '../package.json';
const debug = atom.config.get(`${meta.name}.debug`);
const notEligible = `**${meta.name}**: \`tclsh\` is not in your PATH`;

export function provideBuilder() {
  return class TclshProvider {
    constructor(cwd) {
      this.cwd = cwd;
    }

    getNiceName() {
      return 'Tcl';
    }

    isEligible() {
      exec('which tclsh', function (error, stdout, stderr) {
        if (error !== null) {
          // No tclsh installed
          if (debug === true) atom.notifications.addError(notEligible, { detail: error, dismissable: true });
          return false;
        }
        if (debug === true) atom.notifications.addInfo(`**${meta.name}**`, { detail: stdout, dismissable: false });
      });
      // Let's go!
      return true;
    }

    settings() {
      const errorMatch = [
        '^(?<message>.*)\n((.|\\n)*)\\s+\\(file \\"(?<file>.*)\\" line (?<line>\\d+)\\)'
      ];

      return [
        {
          name: 'tclsh',
          exec: 'tclsh',
          args: [ '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'tclsh:run',
          errorMatch: errorMatch
        }
      ];
    }
  };
}
