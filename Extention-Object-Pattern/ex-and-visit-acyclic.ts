interface BaseSkillVisitor {}

interface FireBreathVisitor extends BaseSkillVisitor {
  visitFireBreath(skill: FireBreath): void;
}

class FireBreath implements Extension {
  accept(v: BaseSkillVisitor): void {
    if ("visitFireBreath" in v) {
      (v as FireBreathVisitor).visitFireBreath(this);
    }
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
