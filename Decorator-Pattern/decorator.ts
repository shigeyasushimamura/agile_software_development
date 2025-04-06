export interface Modem {
  dial(pno: string): void;
  setSpeakerVolume(volume: number): void;
  getPhoneNumber(): string;
  getSpeakerVolume(): number;
}

export class HayesModem implements Modem {
  private itsPhoneNumber: string = "";
  private itsSpeakerVolume: number = 0;
  dial(pno: string) {
    this.itsPhoneNumber = pno;
  }
  setSpeakerVolume(volume: number): void {
    this.itsSpeakerVolume = volume;
  }
  getPhoneNumber(): string {
    return this.itsPhoneNumber;
  }
  getSpeakerVolume(): number {
    return this.itsSpeakerVolume;
  }
}

export class LoudDialModem implements Modem {
  private itsModem?: Modem;
  constructor(m: Modem) {
    this.itsModem = m;
  }

  dial(pno: string) {
    this.itsModem?.setSpeakerVolume(11);
    this.itsModem?.dial(pno);
  }

  setSpeakerVolume(volume: number): void {
    this.itsModem?.setSpeakerVolume(volume);
  }

  getPhoneNumber(): string {
    return this.itsModem?.getPhoneNumber() || "";
  }

  getSpeakerVolume(): number {
    return this.itsModem?.getSpeakerVolume() || 0;
  }
}
