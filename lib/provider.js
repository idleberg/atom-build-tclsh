'use babel';

import { install } from 'atom-package-deps';
import { spawnSync } from 'child_process';

// Package settings
import meta from '../package.json';

// This package depends on build, make sure it's installed
export function activate() {
  if (!atom.inSpecMode()) {
    install(meta.name);
  }
}

export function provideBuilder() {
  return class TclshProvider {
    constructor(cwd) {
      this.cwd = cwd;
    }

    getNiceName() {
      return 'Tcl';
    }

    isEligible() {
      try {
        spawnSync('which tclsh');
      } catch (error) {
        if (atom.inDevMode()) atom.notifications.addError(meta.name, { detail: error, dismissable: true });
        return false;
      }

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
