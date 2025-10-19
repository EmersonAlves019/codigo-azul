import { useState, useEffect } from 'react';

export interface PersonalizationData {
  objetivo: string;
  outroObjetivo?: string;
  inflamacao: string;
  sono: string;
  atividadeFisica: string;
  alimentacao: string;
  jejum: string;
  pilarPrincipal: 'desinflamar' | 'reequilibrar' | 'rejuvenescer';
  intensidadeFoco: {
    desinflamar: number;
    reequilibrar: number;
    rejuvenescer: number;
  };
}

export const usePersonalization = () => {
  const [personalization, setPersonalization] = useState<PersonalizationData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('personalizationData');
    if (saved) {
      setPersonalization(JSON.parse(saved));
    }
  }, []);

  const savePersonalization = (data: PersonalizationData) => {
    localStorage.setItem('personalizationData', JSON.stringify(data));
    setPersonalization(data);
  };

  const calculatePersonalization = (answers: {
    objetivo: string;
    outroObjetivo?: string;
    inflamacao: string;
    sono: string;
    atividadeFisica: string;
    alimentacao: string;
    jejum: string;
  }): PersonalizationData => {
    let scores = {
      desinflamar: 0,
      reequilibrar: 0,
      rejuvenescer: 0,
    };

    // Pontuação baseada no objetivo
    if (answers.objetivo === 'perder-peso') scores.reequilibrar += 3;
    if (answers.objetivo === 'energia') scores.reequilibrar += 2;
    if (answers.objetivo === 'sono') scores.rejuvenescer += 3;
    if (answers.objetivo === 'inchaco') scores.desinflamar += 3;
    if (answers.objetivo === 'pele') scores.rejuvenescer += 2;
    if (answers.objetivo === 'digestao') scores.desinflamar += 2;

    // Pontuação baseada em inflamação
    if (answers.inflamacao === 'sempre' || answers.inflamacao === 'frequentemente') {
      scores.desinflamar += 3;
    } else if (answers.inflamacao === 'as-vezes') {
      scores.desinflamar += 2;
    }

    // Pontuação baseada em sono
    if (answers.sono === 'ruim' || answers.sono === 'regular') {
      scores.rejuvenescer += 2;
    }

    // Pontuação baseada em atividade física
    if (answers.atividadeFisica === 'nunca' || answers.atividadeFisica === 'raramente') {
      scores.reequilibrar += 2;
    }

    // Pontuação baseada em alimentação
    if (answers.alimentacao === 'processados' || answers.alimentacao === 'desregrada') {
      scores.desinflamar += 2;
    }

    // Pontuação baseada em jejum
    if (answers.jejum === 'interesse' || answers.jejum === 'regularmente') {
      scores.reequilibrar += 1;
    }

    // Determinar pilar principal
    const maxScore = Math.max(scores.desinflamar, scores.reequilibrar, scores.rejuvenescer);
    let pilarPrincipal: 'desinflamar' | 'reequilibrar' | 'rejuvenescer' = 'desinflamar';
    
    if (scores.desinflamar === maxScore) pilarPrincipal = 'desinflamar';
    else if (scores.reequilibrar === maxScore) pilarPrincipal = 'reequilibrar';
    else pilarPrincipal = 'rejuvenescer';

    // Normalizar scores para percentuais
    const total = scores.desinflamar + scores.reequilibrar + scores.rejuvenescer;
    const intensidadeFoco = {
      desinflamar: Math.round((scores.desinflamar / total) * 100),
      reequilibrar: Math.round((scores.reequilibrar / total) * 100),
      rejuvenescer: Math.round((scores.rejuvenescer / total) * 100),
    };

    return {
      ...answers,
      pilarPrincipal,
      intensidadeFoco,
    };
  };

  return {
    personalization,
    savePersonalization,
    calculatePersonalization,
  };
};
