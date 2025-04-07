// 全ての拡張スキルの親
interface Extension {}

interface BaseSkillVisitor {}

interface FireBreathVisitor extends BaseSkillVisitor {
  visitFireBreath(skill: FireBreath): void;
}

interface HealSkillVisitor extends BaseSkillVisitor {
  visitHealSkill(skill: HealSkill): void;
}

class FireBreath implements Extension {
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
}

class SkillReportVisitor implements FireBreathVisitor, HealSkillVisitor {
  skills: string[] = [];

  visitFireBreath(skill: FireBreath) {
    this.skills.push("Fire Breath");
  }

  visitHealSkill(skill: HealSkill) {
    this.skills.push("Heal");
  }

  getReport() {
    return this.skills;
  }
}
