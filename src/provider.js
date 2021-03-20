import { configSchema, getConfig } from './config';
import { satisfyDependencies } from 'atom-satisfy-dependencies';
import { spawnSync } from 'child_process';
import { which } from './util';
import meta from '../package.json';

export { configSchema as config };

export function provideBuilder() {
  return class TclshProvider {
    constructor(cwd) {
      this.cwd = cwd;
    }

    getNiceName() {
      return 'Tcl';
    }

    isEligible() {
      if (getConfig('alwaysEligible') === true) {
        return true;
      }

      const cmd = spawnSync(which(), ['tclsh']);
      if (!cmd.stdout.toString()) {
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

// This package depends on build, make sure it's installed
export function activate() {
  if (getConfig('manageDependencies') === true) {
    satisfyDependencies(meta.name);
  }
}
