// 全ての拡張スキルの親
interface Extension {}

interface SkillVisitor {
  visit(skill: FireBreath): void;
  visit(skill: HealSkill): void;
  visit(skill: PoisonResistanceSkill): void;
  visit(skill: WaterBreathingSkill): void;
}

export class FireBreath implements Extension {
  breatheFire(): string {
    return "🔥 Goblin breathes fire!";
  }

  accept(visitor: SkillVisitor): void {
    visitor.visit(this);
  }
}

export class HealSkill implements Extension {
  heal(): string {
    return "✨ Goblin heals itself!";
  }

  accept(visitor: SkillVisitor): void {
    visitor.visit(this);
  }
}

class PoisonResistanceSkill implements Extension {
  resistPoison(): string {
    return "🛡️ Goblin resists poison!";
  }

  accept(visitor: SkillVisitor): void {
    visitor.visit(this);
  }
}

class WaterBreathingSkill implements Extension {
  breatheUnderwater(): string {
    return "🐠 Goblin breathes underwater!";
  }

  accept(visitor: SkillVisitor): void {
    visitor.visit(this);
  }
}

class SkillReportVisitor implements SkillVisitor {
  private skills: string[] = [];

  visit(skill: FireBreath): void {
    this.skills.push("Fire Breath");
  }

  visit(skill: HealSkill): void {
    this.skills.push("Heal");
  }

  visit(skill: PoisonResistanceSkill): void {
    this.skills.push("Poison Resistance");
  }

  visit(skill: WaterBreathingSkill): void {
    this.skills.push("Water Breathing");
  }

  getReport(): string[] {
    return this.skills;
  }
}

// キャラクターオブジェクトの実装
interface ExtensionHost {
  addExtension<T extends Extension>(ext: T): void;
  getExtension<T extends Extension>(ctor: new () => T): T | undefined;
}

function visitAllExtensions(host: ExtensionHost, visitor: SkillVisitor) {
  const skillTypes = [
    FireBreath,
    HealSkill,
    PoisonResistanceSkill,
    WaterBreathingSkill,
  ];

  for (const type of skillTypes) {
    const skill = host.getExtension(type);
    if (skill && "accept" in skill) {
      (skill as any).accept(visitor);
    }
  }
}
