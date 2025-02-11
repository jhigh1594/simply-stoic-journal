import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { motion } from 'framer-motion'

const EveningReflection = () => {
  const actionsEditor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[100px] focus:outline-none'
      }
    }
  })

  const learningEditor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[100px] focus:outline-none'
      }
    }
  })

  const preparationEditor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[100px] focus:outline-none'
      }
    }
  })

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Actions & Character Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">📝 Today's Actions & Character</h2>
          <blockquote className="italic text-gray-600">
            "First say to yourself what you would be; then do what you have to do." - Epictetus
          </blockquote>
          
          <div className="space-y-4">
            <h3 className="text-xl">What virtues did I practice today?</h3>
            <div className="space-y-4 pl-4">
              <div>
                <h4 className="font-semibold">Wisdom:</h4>
                <EditorContent editor={actionsEditor} />
              </div>
              <div>
                <h4 className="font-semibold">Courage:</h4>
                <EditorContent editor={actionsEditor} />
              </div>
              <div>
                <h4 className="font-semibold">Justice:</h4>
                <EditorContent editor={actionsEditor} />
              </div>
              <div>
                <h4 className="font-semibold">Temperance:</h4>
                <EditorContent editor={actionsEditor} />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl">Where did I fall short?</h3>
              <p className="text-sm text-gray-500">(Focus on what was in your control)</p>
              <EditorContent editor={actionsEditor} />
            </div>
          </div>
        </section>

        {/* Learning & Growth Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">💡 Learning & Growth</h2>
          <blockquote className="italic text-gray-600">
            "Every day we should bring some worthy saying to our minds." - Seneca
          </blockquote>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl">What unexpected challenge taught me something today?</h3>
              <EditorContent editor={learningEditor} />
            </div>
            <div>
              <h3 className="text-xl">How will I use this lesson tomorrow?</h3>
              <EditorContent editor={learningEditor} />
            </div>
          </div>
        </section>

        {/* Tomorrow's Preparation Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">⚡️ Tomorrow's Preparation</h2>
          <blockquote className="italic text-gray-600">
            "When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly." - Marcus Aurelius
          </blockquote>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl">What challenges might I face tomorrow?</h3>
              <EditorContent editor={preparationEditor} />
            </div>
            <div>
              <h3 className="text-xl">How will I prepare to meet them with virtue?</h3>
              <EditorContent editor={preparationEditor} />
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  )
}

export default EveningReflection