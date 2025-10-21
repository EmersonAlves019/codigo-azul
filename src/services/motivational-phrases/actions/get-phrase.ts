"use server"

export async function getPhrase() {
    const phrases = [
        'Você está mais perto do que imagina!',
        'Cada pequeno passo conta 💙',
        'Sua consistência está transformando sua vida',
        'Você merece essa transformação',
        'A mudança começa de dentro para fora',
        'Celebre cada vitória, por menor que seja',
    ]

    const randomIndex = Math.floor(Math.random() * phrases.length)
    return phrases[randomIndex]
}
