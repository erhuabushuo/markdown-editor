window.addEventListener('load', function() {
    Vue.filter('date', time => moment(time).format('YYYY-MM-DD, HH:mm'))

    new Vue({
        el: '#notebook',
        data() {
            return {
                notes: JSON.parse(localStorage.getItem('notes')) || [],
                selectedId: localStorage.getItem('selected-id') || null,
            }
        },
        computed: {
            selectedNote() {
                return this.notes.find(note => note.id === this.selectedId)
            },
            notePreview() {
                return this.selectedNote ? marked(this.selectedNote.content) : '';
            },
            addButtonTitle() {
                return `已有${this.notes.length}条笔记`;
            },
            sortedNotes() {
                return this.notes.slice()
                    .sort((a, b) => a.created - b.created)
                    .sort((a, b) => (a.favorite === b.favorite) ? 0
                        : a.favorite ? -1
                        : 1)
            },
            linesCount() {
                if (this.selectedNote) {
                  // 计算换行符的个数
                  return this.selectedNote.content.split(/\r\n|\r|\n/).length
                }
            },
            charactersCount() {
                if (this.selectedNote) {
                    return this.selectedNote.content.split('').length
                }
            }
        },
        methods: {
            addNote() {
                const time = Date.now();
                const note = {
                    id: String(time),
                    title: '笔记 ' + (this.notes.length + 1),
                    content: '**你好！** 使用 [markdown](https://github.com/erhuabushuo/markdown-editor) 进行编写',
                    created: time,
                    favorite: false
                };
                this.notes.push(note);
            },
            selectNode(note) {
                this.selectedId = note.id
            },
            saveNotes() {
                localStorage.setItem('notes', JSON.stringify(this.notes));
                console.log('Notes saved!', new Date());
            },
            removeNote() {
                if (this.selectedNote && confirm('确认删除该笔记？')) {
                    const index = this.notes.indexOf(this.selectedNote);
                    if (index !== -1) {
                        this.notes.splice(index, 1);
                    }
                }
            },
            favoriteNote() {
                this.selectedNote.favorite = !this.selectedNote.favorite;
            }
        },
        watch: {
            notes: {
                handler: 'saveNotes',
                deep: true
            },
            selectedId(val) {
                localStorage.setItem('selected-id', val);
            }
        }
    });
});