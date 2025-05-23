import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/navbar";

const TermsOfService = () => {
  return (
    <div>
      <Navbar />
      <Card className="w-full max-w-4xl mx-auto my-8 mt-20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Termos de Serviço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2">1. Termos</h2>
                <p>
                  Ao acessar ao site{" "}
                  <a
                    href="https://pulse.freecorps.xyz/"
                    className="text-blue-600 hover:underline"
                  >
                    Pulse
                  </a>
                  , concorda em cumprir estes termos de serviço, todas as leis e
                  regulamentos aplicáveis e concorda que é responsável pelo
                  cumprimento de todas as leis locais aplicáveis. Se você não
                  concordar com algum desses termos, está proibido de usar ou
                  acessar este site. Os materiais contidos neste site são
                  protegidos pelas leis de direitos autorais e marcas comerciais
                  aplicáveis.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  2. Uso de Licença
                </h2>
                <p>
                  É concedida permissão para baixar temporariamente uma cópia
                  dos materiais (informações ou software) no site Pulse, apenas
                  para visualização transitória pessoal e não comercial. Esta é
                  a concessão de uma licença, não uma transferência de título e,
                  sob esta licença, você não pode:
                </p>
                <ol className="list-decimal pl-5 space-y-1 mt-2">
                  <li>modificar ou copiar os materiais; </li>
                  <li>
                    usar os materiais para qualquer finalidade comercial ou para
                    exibição pública (comercial ou não comercial);{" "}
                  </li>
                  <li>
                    tentar descompilar ou fazer engenharia reversa de qualquer
                    software contido no site Pulse;{" "}
                  </li>
                  <li>
                    remover quaisquer direitos autorais ou outras notações de
                    propriedade dos materiais; ou{" "}
                  </li>
                  <li>
                    transferir os materiais para outra pessoa ou
                    &apos;espelhe&apos; os materiais em qualquer outro servidor.
                  </li>
                </ol>
                <p className="mt-2">
                  Esta licença será automaticamente rescindida se você violar
                  alguma dessas restrições e poderá ser rescindida por Pulse a
                  qualquer momento. Ao encerrar a visualização desses materiais
                  ou após o término desta licença, você deve apagar todos os
                  materiais baixados em sua posse, seja em formato eletrónico ou
                  impresso.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  3. Isenção de responsabilidade
                </h2>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Os materiais no site da Pulse são fornecidos &apos;como
                    estão&apos;. Pulse não oferece garantias, expressas ou
                    implícitas, e, por este meio, isenta e nega todas as outras
                    garantias, incluindo, sem limitação, garantias implícitas ou
                    condições de comercialização, adequação a um fim específico
                    ou não violação de propriedade intelectual ou outra violação
                    de direitos.
                  </li>
                  <li>
                    Além disso, o Pulse não garante ou faz qualquer
                    representação relativa à precisão, aos resultados prováveis
                    ou à confiabilidade do uso dos materiais em seu site ou de
                    outra forma relacionado a esses materiais ou em sites
                    vinculados a este site.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">4. Limitações</h2>
                <p>
                  Em nenhum caso o Pulse ou seus fornecedores serão responsáveis
                  por quaisquer danos (incluindo, sem limitação, danos por perda
                  de dados ou lucro ou devido a interrupção dos negócios)
                  decorrentes do uso ou da incapacidade de usar os materiais em
                  Pulse, mesmo que Pulse ou um representante autorizado da Pulse
                  tenha sido notificado oralmente ou por escrito da
                  possibilidade de tais danos. Como algumas jurisdições não
                  permitem limitações em garantias implícitas, ou limitações de
                  responsabilidade por danos conseqüentes ou incidentais, essas
                  limitações podem não se aplicar a você.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  5. Precisão dos materiais
                </h2>
                <p>
                  Os materiais exibidos no site da Pulse podem incluir erros
                  técnicos, tipográficos ou fotográficos. Pulse não garante que
                  qualquer material em seu site seja preciso, completo ou atual.
                  Pulse pode fazer alterações nos materiais contidos em seu site
                  a qualquer momento, sem aviso prévio. No entanto, Pulse não se
                  compromete a atualizar os materiais.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">6. Links</h2>
                <p>
                  O Pulse não analisou todos os sites vinculados ao seu site e
                  não é responsável pelo conteúdo de nenhum site vinculado. A
                  inclusão de qualquer link não implica endosso por Pulse do
                  site. O uso de qualquer site vinculado é por conta e risco do
                  usuário.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">Modificações</h3>
                <p>
                  O Pulse pode revisar estes termos de serviço do site a
                  qualquer momento, sem aviso prévio. Ao usar este site, você
                  concorda em ficar vinculado à versão atual desses termos de
                  serviço.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">Lei aplicável</h3>
                <p>
                  Estes termos e condições são regidos e interpretados de acordo
                  com as leis do Pulse e você se submete irrevogavelmente à
                  jurisdição exclusiva dos tribunais naquele estado ou
                  localidade.
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfService;
