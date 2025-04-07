// ✅ Extension interface
export interface Extension {}

// ✅ Base visitor interface
export interface BaseSkillVisitor {}

// ✅ Skill-specific visitors
export interface FireBreathVisitor extends BaseSkillVisitor {
  visitFireBreath(skill: FireBreath): void;
}

export interface HealSkillVisitor extends BaseSkillVisitor {
  visitHealSkill(skill: HealSkill): void;
}

// ✅ ExtensionHost interface
export interface ExtensionHost {
  addExtension<T extends Extension>(ext: T): void;
  getExtension<T extends Extension>(ctor: new () => T): T | undefined;
  getAllExtensions(): Extension[];
}

// ✅ Concrete implementation of ExtensionHost
export class Goblin implements ExtensionHost {
  private extensions = new Map<any, Extension>();

  attack(): string {
    return "Goblin attacks with a club";
  }

  addExtension<T extends Extension>(ext: T): void {
    this.extensions.set(ext.constructor, ext);
  }

  getExtension<T extends Extension>(ctor: new () => T): T | undefined {
    return this.extensions.get(ctor) as T;
  }

  getAllExtensions(): Extension[] {
    return Array.from(this.extensions.values());
  }
}

// ✅ Skills implementing Extension and accept()
export class FireBreath implements Extension {
  breatheFire(): string {
    return "🔥 Goblin breathes fire!";
  }

  accept(v: BaseSkillVisitor): void {
    if ("visitFireBreath" in v) {
      (v as FireBreathVisitor).visitFireBreath(this);
    }
  }
}

export class HealSkill implements Extension {
  heal(): string {
    return "✨ Goblin heals itself!";
  }

  accept(v: BaseSkillVisitor): void {
    if ("visitHealSkill" in v) {
      (v as HealSkillVisitor).visitHealSkill(this);
    }
  }
}

// ✅ Skill visitor implementation (for reporting)
export class SkillReportVisitor implements FireBreathVisitor, HealSkillVisitor {
  private result: string[] = [];

  visitFireBreath(skill: FireBreath): void {
    this.result.push("Fire Breath");
  }

  visitHealSkill(skill: HealSkill): void {
    this.result.push("Heal");
  }

  getReport(): string[] {
    return this.result;
  }
}

// ✅ Visit utility for any ExtensionHost
export function visitExtensions(
  host: ExtensionHost,
  visitor: BaseSkillVisitor
) {
  for (const ext of host.getAllExtensions()) {
    if ("accept" in ext && typeof (ext as any).accept === "function") {
      (ext as any).accept(visitor);
    }
  }
}
