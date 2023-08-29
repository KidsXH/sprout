'use client'
export const ClientLog = ({content}: {content: any}) => {
  console.log('[OPENAI]', content)
  return <></>;
};

export default ClientLog;
