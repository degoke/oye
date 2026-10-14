import { planSchema, type LearningPlan, type PrivateQuestion } from '@oye/shared';

const question = (id: string, prompt: string, texts: string[], explanation: string): PrivateQuestion => ({ id, conceptIndex: 0, prompt, options: texts.map((text, index) => ({ id: String(index), text })), correctOptionId: '0', explanation });
export function fixturePlan(objective: string): LearningPlan {
  const interest = /interest|money|saving/i.test(objective);
  const broad = /want to|learn biology|build websites|become|master/i.test(objective);
  const title = interest ? 'Compound interest' : 'Photosynthesis';
  const concepts = [{ title, objective: interest ? 'Explain how interest earns further interest over time.' : 'Explain how plants use light, water, and carbon dioxide to make sugars.', rubric: [
    { id: 'inputs', criterion: interest ? 'Distinguish starting savings from accumulated interest.' : 'Identify light, water, and carbon dioxide as inputs.', essential: true },
    { id: 'process', criterion: interest ? 'Explain why later interest is calculated on a larger balance.' : 'Explain that light energy helps produce sugars and oxygen.', essential: true },
  ] }];
  if (broad) concepts.push({ title: interest ? 'Time and growth' : 'Energy in living things', objective: 'Apply the first concept to a new situation.', rubric: [{ id: 'apply', criterion: 'Apply the concept to a different example.', essential: true }, { id: 'reason', criterion: 'Explain the reasoning behind the example.', essential: true }] });
  return planSchema.parse({ title: broad ? `${title}: a starter pathway` : title, scope: broad ? 'goal' : 'concept', concepts, questions: interest ? [
    question('q1', 'What does compound interest mean?', ['Interest on savings and previously earned interest', 'A fixed fee paid once', 'Interest only on the starting savings'], 'Previously earned interest becomes part of the next interest calculation.'),
    question('q2', '₦1,000 earns 10% in one year. What is the balance?', ['₦1,100', '₦1,010', '₦2,000'], 'Ten percent of ₦1,000 is ₦100.'),
    question('q3', 'If the ₦1,100 remains saved at 10% for another year, what is the next balance?', ['₦1,210', '₦1,200', '₦1,110'], 'The next interest is 10% of ₦1,100, or ₦110.'),
  ] : [
    question('q1', 'Where does a plant get the energy for photosynthesis?', ['Light from the sun', 'The soil alone', 'Oxygen in the air'], 'Plants use energy from light.'),
    question('q2', 'Which materials does a plant use to make sugars?', ['Water and carbon dioxide', 'Oxygen and sand', 'Sugar and oxygen'], 'Plants combine water and carbon dioxide using light energy.'),
    question('q3', 'What is one product of photosynthesis?', ['Oxygen', 'Rock', 'Nitrogen gas'], 'Photosynthesis produces sugars and releases oxygen.'),
  ] });
}
