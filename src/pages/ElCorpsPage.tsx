import { useEffect } from "react";

export default function ElCorpsPage() {
  useEffect(() => {
    document.title = "El Corps - Infinity Comics";
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-zinc-100 mb-4">Quiénes somos</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300 text-lg leading-relaxed mb-4">
            En <strong className="text-[#FF522D]">Infinity Comics</strong>, somos un grupo apasionado por los cómics y la cultura pop. Nuestra misión es compartir nuestra pasión con el mundo, ofreciendo una plataforma donde los amantes de los cómics puedan encontrar sus historias favoritas y descubrir nuevas joyas.
          </p>
          <p className="text-zinc-300 text-lg leading-relaxed">
            Nos esforzamos por mantener viva la magia de los cómics, respetando siempre los derechos de los creadores y propietarios de las obras que compartimos. Este proyecto es sin ánimo de lucro y está hecho con amor para la comunidad.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-zinc-100 mb-6">Nuestro equipo</h2>

        <div className="space-y-8">
          {/* Staff Administrativo */}
          <div>
            <h3 className="text-2xl font-semibold text-[#FF522D] mb-4">Staff Administrativo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="text-zinc-300">Letho (Corrector)</div>
              <div className="text-zinc-300">BrunoRules (Tradumaqueta)</div>
              <div className="text-zinc-300">Pete Starker (Traductor)</div>
              <div className="text-zinc-300">JageR (Tradumaqueta)</div>
              <div className="text-zinc-300">Ferchino (Maqueta)</div>
              <div className="text-zinc-300">Reverse Flash (Traductor)</div>
              <div className="text-zinc-300">Ash Gb Williams (Traductor)</div>
            </div>
          </div>

          {/* Traductores */}
          <div>
            <h3 className="text-2xl font-semibold text-[#FF522D] mb-4">Traductores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="text-zinc-300">Ash Gb Williams</div>
              <div className="text-zinc-300">Checho</div>
              <div className="text-zinc-300">Crash Smasher</div>
              <div className="text-zinc-300">Rojo</div>
              <div className="text-zinc-300">Viggo16</div>
              <div className="text-zinc-300">Grayson</div>
              <div className="text-zinc-300">Shaddap</div>
              <div className="text-zinc-300">Hunter DJ</div>
              <div className="text-zinc-300">Gevy</div>
              <div className="text-zinc-300">RxR</div>
              <div className="text-zinc-300">Sr. Gris</div>
              <div className="text-zinc-300">Heisenberg</div>
              <div className="text-zinc-300">Tim Kent</div>
            </div>
          </div>

          {/* Maquetadores */}
          <div>
            <h3 className="text-2xl font-semibold text-[#FF522D] mb-4">Maquetadores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="text-zinc-300">Moony Stark</div>
              <div className="text-zinc-300">The Dark Bat</div>
              <div className="text-zinc-300">Torch Knight</div>
              <div className="text-zinc-300">Geoblue 86</div>
              <div className="text-zinc-300">Noble-VII</div>
              <div className="text-zinc-300">Crossbreaker</div>
              <div className="text-zinc-300">Huascaj</div>
              <div className="text-zinc-300">Nomi Sunraider</div>
              <div className="text-zinc-300">Fenix</div>
              <div className="text-zinc-300">Steppenwolf</div>
              <div className="text-zinc-300">BeCool</div>
              <div className="text-zinc-300">Mal-X</div>
              <div className="text-zinc-300">Leux_01</div>
              <div className="text-zinc-300">Iro</div>
              <div className="text-zinc-300">G-Ton1c</div>
            </div>
          </div>

          {/* Correctores */}
          <div>
            <h3 className="text-2xl font-semibold text-[#FF522D] mb-4">Correctores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="text-zinc-300">YilWeff</div>
              <div className="text-zinc-300">Grif</div>
              <div className="text-zinc-300">The Runaway</div>
              <div className="text-zinc-300">Khonshu Rec</div>
              <div className="text-zinc-300">MutanteOmegaX</div>
              <div className="text-zinc-300">Knightcrawler</div>
            </div>
          </div>

          {/* Línea de Reserva */}
          <div>
            <h3 className="text-2xl font-semibold text-[#FF522D] mb-4">Línea de Reserva</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="text-zinc-300">McGuerra (Maqueta)</div>
              <div className="text-zinc-300">Izeppi (Maqueta)</div>
              <div className="text-zinc-300">Absolute (Traductor)</div>
              <div className="text-zinc-300">Spider-Bat (Corrector)</div>
              <div className="text-zinc-300">Chico Bestia (Corrector)</div>
              <div className="text-zinc-300">Tony-MTC (Traductor)</div>
              <div className="text-zinc-300">Daniel-MTC (Maqueta)</div>
              <div className="text-zinc-300">Vnshws (Maqueta)</div>
            </div>
          </div>

          {/* Alianzas */}
          <div>
            <h3 className="text-2xl font-semibold text-[#FF522D] mb-4">Alianzas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="text-zinc-300">Gisicom</div>
              <div className="text-zinc-300">Arsenio Lupín</div>
              <div className="text-zinc-300">Outsiders</div>
              <div className="text-zinc-300">Comics 9R</div>
              <div className="text-zinc-300">Jeezy Comics</div>
              <div className="text-zinc-300">CRG</div>
              <div className="text-zinc-300">Marvel Todo Comics</div>
              <div className="text-zinc-300">Eurocomicss</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

