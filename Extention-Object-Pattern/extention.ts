// 全ての拡張スキルの親
interface Extension {}

// キャラクターオブジェクトの実装
interface ExtensionHost {
  addExtension<T extends Extension>(ext: T): void;
  getExtension<T extends Extension>(ctor: new () => T): T | undefined;
}

export class Goblin implements ExtensionHost {
  private extentions = new Map<any, Extension>();

  attack() {
    return "Goblin attacks with a club";
  }
  addExtension<T extends Extension>(ext: T): void {
    this.extentions.set(ext.constructor, ext);
  }

  getExtension<T extends Extension>(ctor: new () => T): T | undefined {
    return this.extentions.get(ctor) as T;
  }
}

export class FireBreath implements Extension {
  breatheFire(): string {
    return "🔥 Goblin breathes fire!";
  }
}

export class HealSkill implements Extension {
  heal(): string {
    return "✨ Goblin heals itself!";
  }
}

class PoisonResistanceSkill implements Extension {
  resistPoison(): string {
    return "🛡️ Goblin resists poison!";
  }
}

class WaterBreathingSkill implements Extension {
  breatheUnderwater(): string {
    return "🐠 Goblin breathes underwater!";
  }
}

class Hero implements ExtensionHost {
  private extensions = new Map<any, Extension>();

  attack() {
    return "Hero strikes with a sword!";
  }

  addExtension<T extends Extension>(ext: T): void {
    this.extensions.set(ext.constructor, ext);
  }

  getExtension<T extends Extension>(ctor: new () => T): T | undefined {
    return this.extensions.get(ctor) as T;
  }
}

class Pet implements ExtensionHost {
  private extensions = new Map<any, Extension>();

  action() {
    return "Pet looks around...";
  }

  addExtension<T extends Extension>(ext: T): void {
    this.extensions.set(ext.constructor, ext);
  }

  getExtension<T extends Extension>(ctor: new () => T): T | undefined {
    return this.extensions.get(ctor) as T;
  }
}
