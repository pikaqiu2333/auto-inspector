import { AgentPersona, AGENT_PERSONAS } from '../domain/agent-personas';

export class PersonaConfigurator {
  /**
   * Get persona by name
   */
  static getPersona(name: string): AgentPersona | undefined {
    return AGENT_PERSONAS.find(p => p.name === name);
  }

  /**
   * Get persona by type
   */
  static getPersonaByType(type: AgentPersona['type']): AgentPersona | undefined {
    return AGENT_PERSONAS.find(p => p.type === type);
  }

  /**
   * Get all personas
   */
  static getAllPersonas(): AgentPersona[] {
    return [...AGENT_PERSONAS];
  }

  /**
   * Create a custom persona
   */
  static createCustomPersona(overrides: Partial<AgentPersona>): AgentPersona {
    const basePersona = AGENT_PERSONAS[0]; // Default to Alice
    return {
      ...basePersona,
      ...overrides
    };
  }

  /**
   * Validate persona configuration
   */
  static validatePersona(persona: AgentPersona): boolean {
    return (
      !!persona.name &&
      ['newbie', 'cautious', 'impatient', 'malicious'].includes(persona.type) &&
      persona.typingSpeed > 0 &&
      typeof persona.readsPrivacy === 'boolean' &&
      typeof persona.fillsOptional === 'boolean' &&
      typeof persona.isMalicious === 'boolean'
    );
  }
}
